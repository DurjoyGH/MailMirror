const prisma = require("../config/prisma");
const { getGmailMessages, getGmailMessage, getGmailAttachment } = require("../services/googleApi");
const { refreshAccessToken } = require("../services/googleApi");

const decodeBase64Url = (value = "") => {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf8");
  } catch {
    return "";
  }
};

const decodeQuotedPrintable = (value = "") =>
  value
    // Soft line breaks
    .replace(/=\r?\n/g, "")
    // Hex escapes, e.g. =3C => <
    .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

const htmlToText = (html = "") =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|tr|table|section|article|li|h[1-6])>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const looksLikeHtml = (value = "") => /<!doctype|<html|<head|<body|<table|<div|<p|<style|<script/i.test(value);

const cleanupPlainText = (value = "") =>
  value
    // Remove raw image URLs and cid references from text-only output
    .replace(/https?:\/\/\S+\.(png|jpg|jpeg|gif|webp|svg)\S*/gi, "")
    .replace(/\bcid:[^\s]+/gi, "")
    // Remove leftover CSS-like lines if any slipped through
    .split("\n")
    .filter((line) => !/^\s*[.#]?[a-zA-Z0-9_-]+\s*\{\s*$/.test(line.trim()))
    .filter((line) => !/^\s*\}\s*$/.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const normalizeBodyText = (bodyText = "", bodyHtml = "") => {
  let normalized = bodyText || "";

  // Many marketing emails come as quoted-printable text that still contains HTML.
  if (/=[A-Fa-f0-9]{2}/.test(normalized)) {
    normalized = decodeQuotedPrintable(normalized);
  }

  if (normalized && looksLikeHtml(normalized)) {
    return cleanupPlainText(htmlToText(normalized));
  }

  if (!normalized && bodyHtml) {
    return cleanupPlainText(htmlToText(bodyHtml));
  }

  return cleanupPlainText(normalized);
};

const readPartData = async (part, accessToken, messageId) => {
  if (part?.body?.data) {
    return decodeBase64Url(part.body.data);
  }

  if (part?.body?.attachmentId) {
    try {
      const attachment = await getGmailAttachment(accessToken, messageId, part.body.attachmentId);
      return decodeBase64Url(attachment?.data || "");
    } catch {
      return "";
    }
  }

  return "";
};

const extractMessageBody = async (payload = {}, accessToken, messageId) => {
  let textBody = "";
  let htmlBody = "";

  const walk = async (part) => {
    if (!part) return;

    if (part.mimeType === "text/plain" && !textBody) {
      textBody = await readPartData(part, accessToken, messageId);
    }

    if (part.mimeType === "text/html" && !htmlBody) {
      htmlBody = await readPartData(part, accessToken, messageId);
    }

    if (Array.isArray(part.parts)) {
      for (const child of part.parts) {
        await walk(child);
      }
    }
  };

  await walk(payload);

  if (!textBody) {
    textBody = await readPartData(payload, accessToken, messageId);
  }

  if (!textBody && htmlBody) {
    textBody = htmlToText(htmlBody);
  }

  textBody = normalizeBodyText(textBody, htmlBody);

  return {
    bodyText: textBody,
    bodyHtml: htmlBody,
  };
};

/**
 * Get user's Gmail messages
 */
const getMailMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📧 [Mail Controller] Fetching mails for user:", userId);

    // Add retry logic for database connection
    let user = null;
    let retries = 3;
    let lastError = null;

    while (retries > 0 && !user) {
      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            accessToken: true,
            refreshToken: true,
            tokenExpiry: true,
          },
        });
        break;
      } catch (dbError) {
        lastError = dbError;
        retries--;
        if (retries > 0) {
          console.warn(`⚠️ [Mail Controller] DB error, retrying (${retries} left):`, dbError.message);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
    }

    if (!user) {
      console.error("❌ [Mail Controller] User not found after retries:", lastError?.message);
      return res.status(401).json({ message: "No Gmail access token found", error: lastError?.message });
    }

    if (!user.accessToken) {
      console.error("❌ [Mail Controller] User has no access token");
      return res.status(401).json({ message: "No Gmail access token found" });
    }

    // Check if token is expired and refresh if needed
    let accessToken = user.accessToken;
    if (user.tokenExpiry && new Date() > new Date(user.tokenExpiry)) {
      console.log("🔄 [Mail Controller] Token expired, refreshing...");
      if (!user.refreshToken) {
        return res.status(401).json({ message: "Token expired and no refresh token available" });
      }

      try {
        const newTokenData = await refreshAccessToken(user.refreshToken);
        accessToken = newTokenData.accessToken;

        // Update user with new token
        await prisma.user.update({
          where: { id: userId },
          data: {
            accessToken: newTokenData.accessToken,
            tokenExpiry: new Date(Date.now() + newTokenData.expiresIn * 1000),
          },
        });
        console.log("✅ [Mail Controller] Token refreshed");
      } catch (refreshError) {
        console.error("❌ [Mail Controller] Token refresh failed:", refreshError.message);
        return res.status(401).json({ message: "Failed to refresh Gmail token" });
      }
    }

    console.log("📡 [Mail Controller] Fetching messages from Gmail API...");
    const messages = await getGmailMessages(accessToken, 20);
    console.log(`✅ [Mail Controller] Got ${messages.length} messages`);

    // Fetch full message details for each
    console.log("📝 [Mail Controller] Fetching message details...");
    const emailList = await Promise.all(
      messages.map(async (msg) => {
        try {
          const fullMessage = await getGmailMessage(accessToken, msg.id);
          const headers = fullMessage.payload?.headers || [];
          const { bodyText, bodyHtml } = await extractMessageBody(fullMessage.payload, accessToken, msg.id);

          const getHeader = (name) => headers.find((h) => h.name === name)?.value || "";

          return {
            id: msg.id,
            threadId: fullMessage.threadId,
            from: getHeader("From"),
            to: getHeader("To"),
            subject: getHeader("Subject"),
            date: getHeader("Date"),
            preview: fullMessage.snippet,
            body: bodyText || fullMessage.snippet || "",
            bodyHtml,
            labels: fullMessage.labelIds || [],
            unread: fullMessage.labelIds?.includes("UNREAD") || false,
            starred: fullMessage.labelIds?.includes("STARRED") || false,
            hasAttachment: fullMessage.payload?.parts?.some((p) => p.filename) || false,
          };
        } catch (error) {
          console.error("❌ [Mail Controller] Error fetching message details:", error.message);
          return null;
        }
      })
    );

    const validEmails = emailList.filter((email) => email !== null);
    console.log(`✅ [Mail Controller] Processed ${validEmails.length} emails`);

    res.json({
      success: true,
      count: validEmails.length,
      emails: validEmails,
    });
  } catch (error) {
    console.error("❌ [Mail Controller] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a share link for inbox
 */
const createShareLink = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔗 [Mail Controller] Creating share link for user:", userId);

    // Generate unique public ID
    const publicId = Math.random().toString(36).substring(2, 10) + 
                     Math.random().toString(36).substring(2, 10);

    const link = await prisma.link.create({
      data: {
        userId,
        publicId,
        title: `${req.user.name}'s Inbox`,
        isActive: true,
      },
    });

    console.log("✅ [Mail Controller] Share link created:", publicId);

    res.json({
      success: true,
      link: {
        id: link.id,
        publicId: link.publicId,
        url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${link.publicId}`,
        createdAt: link.createdAt,
        isActive: link.isActive,
      },
    });
  } catch (error) {
    console.error("❌ [Mail Controller] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user's share links
 */
const getShareLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📋 [Mail Controller] Fetching share links for user:", userId);

    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const linksWithUrl = links.map((link) => ({
      ...link,
      url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${link.publicId}`,
    }));

    console.log(`✅ [Mail Controller] Found ${linksWithUrl.length} share links`);

    res.json({
      success: true,
      links: linksWithUrl,
    });
  } catch (error) {
    console.error("❌ [Mail Controller] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Toggle share link status
 */
const toggleShareLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const userId = req.user.id;

    console.log("🔄 [Mail Controller] Toggling link:", linkId);

    const link = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (link.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.link.update({
      where: { id: linkId },
      data: { isActive: !link.isActive },
    });

    console.log(`✅ [Mail Controller] Link ${linkId} is now ${updated.isActive ? "active" : "inactive"}`);

    res.json({
      success: true,
      link: {
        ...updated,
        url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${updated.publicId}`,
      },
    });
  } catch (error) {
    console.error("❌ [Mail Controller] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMailMessages,
  createShareLink,
  getShareLinks,
  toggleShareLink,
};
