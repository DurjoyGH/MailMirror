import api from "./api";

/**
 * Get user's Gmail messages
 */
export const getMailMessages = (limit = 100) => {
  console.log("📧 [Mail API] Fetching messages...", { limit });
  return api.get("/mail/messages", { params: { limit } });
};

/**
 * Create a share link for inbox
 */
export const createShareLink = () => {
  console.log("🔗 [Mail API] Creating share link...");
  return api.post("/mail/share");
};

/**
 * Get user's share links
 */
export const getShareLinks = () => {
  console.log("📋 [Mail API] Fetching share links...");
  return api.get("/mail/share");
};

/**
 * Toggle share link status
 */
export const toggleShareLink = (linkId) => {
  console.log("🔄 [Mail API] Toggling link:", linkId);
  return api.patch(`/mail/share/${linkId}`);
};

/**
 * Delete a share link
 */
export const deleteShareLink = (linkId) => {
  console.log("🗑️ [Mail API] Deleting link:", linkId);
  return api.delete(`/mail/share/${linkId}`);
};
