const fs = require("fs");
const path = require("path");

/**
 * Loads the base HTML email template and replaces all {{PLACEHOLDERS}}.
 *
 * @param {Object} data - Content to inject into the template
 * @param {string} data.preheaderText   - Short preview text shown in inbox (hidden in email)
 * @param {string} data.emailBadge      - Small pill label e.g. "Welcome" | "Security Alert" | "Notification"
 * @param {string} data.emailTitle      - Main bold heading in the dark blue band
 * @param {string} data.emailSubtitle   - Smaller subtitle under the heading
 * @param {string} data.recipientName   - Recipient's first name for the greeting
 * @param {string} data.emailBody       - Main HTML body content (paragraphs, lists etc.)
 * @param {string} data.ctaUrl          - CTA button link (pass "#" or "" to hide)
 * @param {string} data.ctaText         - CTA button label e.g. "Verify Email"
 * @param {string} data.infoBoxContent  - HTML inside the teal info box (pass "" to hide)
 * @param {string} data.emailClosing    - Closing line before signature e.g. "Thanks for using MailMirror!"
 * @param {string} [data.baseUrl]       - Base URL of your app e.g. "https://mailmirror.app"
 * @param {string} [data.unsubscribeUrl]- Unsubscribe link
 * @returns {string} - Final compiled HTML string ready to send
 */
function buildEmail(data) {
  const templatePath = path.join(__dirname, "email-template.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  const baseUrl        = data.baseUrl        || "https://mailmirror.app";
  const unsubscribeUrl = data.unsubscribeUrl || `${baseUrl}/unsubscribe`;
  const year           = new Date().getFullYear();

  const replacements = {
    "{{PREHEADER_TEXT}}":    data.preheaderText   || "",
    "{{EMAIL_BADGE}}":       data.emailBadge      || "Notification",
    "{{EMAIL_TITLE}}":       data.emailTitle      || "",
    "{{EMAIL_SUBTITLE}}":    data.emailSubtitle   || "",
    "{{RECIPIENT_NAME}}":    data.recipientName   || "there",
    "{{EMAIL_BODY}}":        data.emailBody       || "",
    "{{CTA_URL}}":           data.ctaUrl          || "#",
    "{{CTA_TEXT}}":          data.ctaText         || "Visit MailMirror",
    "{{INFO_BOX_CONTENT}}":  data.infoBoxContent  || "",
    "{{EMAIL_CLOSING}}":     data.emailClosing    || "Thanks for using MailMirror!",
    "{{BASE_URL}}":          baseUrl,
    "{{UNSUBSCRIBE_URL}}":   unsubscribeUrl,
    "{{YEAR}}":              String(year),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value);
  }

  return html;
}

module.exports = { buildEmail };
