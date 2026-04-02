/**
 * Email content templates for different scenarios
 * Each template returns an object ready to pass to buildEmail()
 */

const emailContent = {
  /**
   * Welcome email when user creates an account
   */
  welcome: (userName) => ({
    preheaderText: "Welcome to MailMirror — your secure Gmail sharing tool.",
    emailBadge: "Welcome",
    emailTitle: "Welcome to MailMirror! 🎉",
    emailSubtitle: "Your account is ready. Let's get you started.",
    recipientName: userName || "there",
    emailBody: `
      <p>We're thrilled to have you on board!</p>
      <p style="margin-top:12px;">With MailMirror, you can:</p>
      <ul style="margin:12px 0 0 20px; padding:0; color:rgba(27,73,101,0.75);">
        <li style="margin-bottom:8px;">Generate a secure, read-only link to your Gmail inbox</li>
        <li style="margin-bottom:8px;">Share it with anyone — no Gmail access required</li>
        <li style="margin-bottom:8px;">Enable or disable sharing at any time</li>
      </ul>
      <p style="margin-top:16px;">Ready to get started? Click the button below to explore your dashboard.</p>
    `,
    ctaUrl: "{{BASE_URL}}/your-mails",
    ctaText: "Open My Dashboard →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:12px;
        font-weight:700; color:#1b4965; margin:0 0 6px; text-transform:uppercase;
        letter-spacing:0.06em;">🔒 Read-Only Guarantee</p>
      <p style="font-family:'Montserrat',sans-serif; font-size:13px;
        color:rgba(27,73,101,0.7); font-weight:500; margin:0; line-height:1.6;">
        MailMirror only has <strong>gmail.readonly</strong> access.
        We can never send, delete, or modify any email on your behalf.
      </p>
    `,
    emailClosing: "Welcome aboard — we're glad you're here.",
  }),

  /**
   * Email verification
   */
  verifyEmail: (userName, verificationLink) => ({
    preheaderText: "Verify your email address to complete your MailMirror account setup.",
    emailBadge: "Verify Email",
    emailTitle: "Verify your email address",
    emailSubtitle: "Complete your account setup in one click.",
    recipientName: userName || "there",
    emailBody: `
      <p>Thanks for signing up! We just need to verify your email address to complete your account setup.</p>
      <p style="margin-top:12px;">Click the button below to verify your email and start using MailMirror.</p>
    `,
    ctaUrl: verificationLink || "{{BASE_URL}}/verify-email",
    ctaText: "Verify My Email →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:11px;
        font-weight:700; color:rgba(27,73,101,0.5); text-transform:uppercase;
        letter-spacing:0.08em; margin:0 0 6px;">Link Expiration</p>
      <p style="font-family:'Montserrat',sans-serif; font-size:12px;
        color:rgba(27,73,101,0.65); font-weight:500; margin:0; line-height:1.6;">
        This verification link expires in 24 hours.
      </p>
    `,
    emailClosing: "If you didn't create this account, you can safely ignore this email.",
  }),

  /**
   * Password reset email
   */
  passwordReset: (userName, resetLink) => ({
    preheaderText: "Reset your MailMirror password — link expires in 15 minutes.",
    emailBadge: "Password Reset",
    emailTitle: "Reset your password",
    emailSubtitle: "This link expires in 15 minutes.",
    recipientName: userName || "there",
    emailBody: `
      <p>We received a request to reset the password for your MailMirror account.</p>
      <p style="margin-top:12px;">Click the button below to choose a new password. If you didn't request this, you can safely ignore this email.</p>
    `,
    ctaUrl: resetLink || "{{BASE_URL}}/reset-password",
    ctaText: "Reset My Password →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:12px;
        font-weight:700; color:#1b4965; margin:0 0 4px;">⚠️ This link expires in 15 minutes.</p>
      <p style="font-family:'Montserrat',sans-serif; font-size:12px;
        color:rgba(27,73,101,0.65); font-weight:500; margin:0; line-height:1.6;">
        If you did not request a password reset, please ignore this email.
        Your account remains secure.
      </p>
    `,
    emailClosing: "If you didn't request this, no action is needed.",
  }),

  /**
   * Share link created notification
   */
  shareLinkCreated: (userName, shareLink) => ({
    preheaderText: "Your MailMirror share link is live and ready.",
    emailBadge: "Share Link Created",
    emailTitle: "Your inbox is now shared",
    emailSubtitle: "Anyone with your link can view your inbox in read-only mode.",
    recipientName: userName || "there",
    emailBody: `
      <p>You just generated a new public share link for your Gmail inbox.</p>
      <p style="margin-top:12px;">Share the link below with anyone you'd like to give read-only access to your inbox. You can disable this link anytime.</p>
    `,
    ctaUrl: shareLink || "{{BASE_URL}}/view",
    ctaText: "View Shared Inbox →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:11px;
        font-weight:700; color:rgba(27,73,101,0.5); text-transform:uppercase;
        letter-spacing:0.08em; margin:0 0 6px;">Your Share Link</p>
      <p style="font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700;
        color:#1b4965; word-break:break-all; margin:0;">
        ${shareLink}
      </p>
      <p style="font-family:'Montserrat',sans-serif; font-size:11px;
        color:rgba(27,73,101,0.5); font-weight:500; margin:8px 0 0;">
        You can disable this link anytime from the Your Mails page.
      </p>
    `,
    emailClosing: "You can manage or delete this link at any time from your dashboard.",
  }),

  /**
   * Share link disabled notification
   */
  shareLinkDisabled: (userName) => ({
    preheaderText: "Your MailMirror share link has been disabled.",
    emailBadge: "Share Link Disabled",
    emailTitle: "Your share link is now disabled",
    emailSubtitle: "No one can access your inbox via this link anymore.",
    recipientName: userName || "there",
    emailBody: `
      <p>You just disabled a public share link to your Gmail inbox.</p>
      <p style="margin-top:12px;">If this wasn't intentional, you can generate a new share link from your dashboard at any time.</p>
    `,
    ctaUrl: "{{BASE_URL}}/your-mails",
    ctaText: "Go to Dashboard →",
    infoBoxContent: "",
    emailClosing: "Your inbox is now private again.",
  }),

  /**
   * Security alert - New sign-in
   */
  securityAlert: (userName, deviceInfo, location) => ({
    preheaderText: "A new sign-in was detected on your MailMirror account.",
    emailBadge: "Security Alert",
    emailTitle: "New sign-in detected",
    emailSubtitle: "Review recent activity on your account.",
    recipientName: userName || "there",
    emailBody: `
      <p>A new sign-in to your MailMirror account was detected. If this was you, no action is needed.</p>
      <p style="margin-top:12px;">If you don't recognize this sign-in, please change your password immediately.</p>
    `,
    ctaUrl: "{{BASE_URL}}/dashboard",
    ctaText: "Review Account Activity →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:11px;
        font-weight:700; color:rgba(27,73,101,0.5); text-transform:uppercase;
        letter-spacing:0.08em; margin:0 0 10px;">Sign-In Details</p>
      <table style="width:100%; font-family:'Montserrat',sans-serif;
        font-size:12px; color:rgba(27,73,101,0.75);">
        <tr><td style="padding:3px 0; font-weight:600; width:110px;">Device</td>
            <td style="padding:3px 0; font-weight:500;">${deviceInfo || "Unknown"}</td></tr>
        <tr><td style="padding:3px 0; font-weight:600;">Location</td>
            <td style="padding:3px 0; font-weight:500;">${location || "Unknown"}</td></tr>
        <tr><td style="padding:3px 0; font-weight:600;">Time</td>
            <td style="padding:3px 0; font-weight:500;">${new Date().toLocaleString()}</td></tr>
      </table>
    `,
    emailClosing: "If you don't recognize this sign-in, please change your password immediately.",
  }),

  /**
   * Contact form submission confirmation
   */
  contactConfirmation: (userName, subject) => ({
    preheaderText: "We received your message. Thank you for reaching out!",
    emailBadge: "Message Received",
    emailTitle: "Thanks for reaching out!",
    emailSubtitle: "We'll get back to you soon.",
    recipientName: userName || "there",
    emailBody: `
      <p>We received your message and appreciate you taking the time to contact us.</p>
      <p style="margin-top:12px;">Our team will review your inquiry and get back to you as soon as possible. Thank you for your patience!</p>
    `,
    ctaUrl: "{{BASE_URL}}/contact",
    ctaText: "Send Another Message →",
    infoBoxContent: `
      <p style="font-family:'Montserrat',sans-serif; font-size:11px;
        font-weight:700; color:rgba(27,73,101,0.5); text-transform:uppercase;
        letter-spacing:0.08em; margin:0 0 6px;">Your Message</p>
      <p style="font-family:'Montserrat',sans-serif; font-size:12px;
        color:rgba(27,73,101,0.75); font-weight:500; margin:0; line-height:1.6;">
        ${subject}
      </p>
    `,
    emailClosing: "We'll be in touch shortly.",
  }),
};

module.exports = emailContent;
