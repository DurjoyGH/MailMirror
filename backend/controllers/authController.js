const prisma = require("../config/prisma");
const { generateToken, generateVerificationToken } = require("../services/jwt");
const { getAccessToken, getUserProfile } = require("../services/googleApi");
const sendEmail = require("../services/email");
const emailContent = require("../utils/emailContent");
const { buildEmail } = require("../utils/emailTemplate");

/**
 * Google OAuth callback - Login or Register
 */
const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("🔍 [Google Callback] Received code:", code ? "✅ Yes" : "❌ No");

    if (!code) {
      console.error("❌ [Google Callback] Authorization code is missing");
      return res.status(400).json({ message: "Authorization code is required" });
    }

    // Get access token from Google
    console.log("📡 [Google Callback] Getting access token from Google...");
    const tokenData = await getAccessToken(code);
    console.log("✅ [Google Callback] Access token received:", {
      accessToken: tokenData.accessToken ? "✅ Yes" : "❌ No",
      refreshToken: tokenData.refreshToken ? "✅ Yes" : "❌ No",
      expiresIn: tokenData.expiresIn,
    });

    // Get user profile from Google
    console.log("👤 [Google Callback] Getting user profile from Google...");
    const userProfile = await getUserProfile(tokenData.accessToken);
    console.log("✅ [Google Callback] User profile received:", {
      googleId: userProfile.googleId,
      email: userProfile.email,
      name: userProfile.name,
    });

    // Check if user exists
    console.log("🔎 [Google Callback] Checking if user exists in DB...");
    let user = await prisma.user.findUnique({
      where: { email: userProfile.email },
    });
    console.log(user ? "✅ [Google Callback] User found in DB" : "❌ [Google Callback] User NOT found - will create new");

    // Calculate token expiry
    const tokenExpiry = new Date(Date.now() + tokenData.expiresIn * 1000);

    if (user) {
      // Update existing user with new tokens
      console.log("📝 [Google Callback] Updating existing user...");
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          tokenExpiry,
          picture: userProfile.picture,
          name: userProfile.name,
          updatedAt: new Date(),
        },
      });
      console.log("✅ [Google Callback] User updated:", user.id);
    } else {
      // Create new user
      console.log("✨ [Google Callback] Creating new user...");
      user = await prisma.user.create({
        data: {
          email: userProfile.email,
          name: userProfile.name,
          picture: userProfile.picture,
          googleId: userProfile.googleId,
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          tokenExpiry,
        },
      });
      console.log("✅ [Google Callback] New user created:", user.id);

      // Send welcome email
      try {
        console.log("📧 [Google Callback] Sending welcome email...");
        const emailData = emailContent.welcome(user.name?.split(" ")[0] || "there");
        const html = buildEmail(emailData);

        await sendEmail({
          to: user.email,
          subject: "Welcome to MailMirror! 🎉",
          html,
        });
        console.log("✅ [Google Callback] Welcome email sent to:", user.email);
      } catch (emailError) {
        console.error("⚠️ [Google Callback] Email sending failed:", emailError.message);
        console.log("📝 [Google Callback] Note: Set EMAIL and EMAIL_PASSWORD in .env to enable emails");
        // Don't fail the signup if email sending fails - it's non-critical
      }
    }

    // Generate JWT token
    console.log("🔐 [Google Callback] Generating JWT token...");
    const jwtToken = generateToken({ id: user.id, email: user.email });
    console.log("✅ [Google Callback] JWT token generated");

    // Create session
    console.log("💾 [Google Callback] Creating session...");
    await prisma.session.create({
      data: {
        userId: user.id,
        token: jwtToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    console.log("✅ [Google Callback] Session created");

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const callbackUrl = `${frontendUrl}/auth/callback?token=${jwtToken}&userId=${user.id}`;
    console.log("🔗 [Google Callback] Redirecting to:", callbackUrl);
    return res.redirect(callbackUrl);
  } catch (error) {
    console.error("❌ [Google Callback] Error:", error.message);
    console.error(error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`
    );
  }
};

/**
 * Manual email registration
 */
const registerEmail = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user with temporary data
    const user = await prisma.user.create({
      data: {
        email,
        name,
        googleId: `manual_${Date.now()}`, // Temporary identifier
        refreshToken: "", // Will be set after verification
      },
    });

    // Send verification email
    try {
      const firstName = name.split(" ")[0];
      const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/verify?token=${verificationToken}&email=${email}`;

      const emailData = emailContent.verifyEmail(firstName, verificationLink);
      const html = buildEmail(emailData);

      await sendEmail({
        to: email,
        subject: "Verify your email - MailMirror",
        html,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError.message);
      // Delete user if email fails
      await prisma.user.delete({ where: { id: user.id } });
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(201).json({
      message: "Registration successful! Please verify your email.",
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Email registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify email token
 */
const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Email and token are required" });
    }

    // Note: In production, you should store the verification token in the database
    // For now, this is a placeholder. Implement proper token storage.

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        updatedAt: new Date(),
      },
    });

    // Generate JWT token
    const jwtToken = generateToken({ id: user.id, email: user.email });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: jwtToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.json({
      message: "Email verified successfully!",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    console.log("👤 [Get Current User] User ID:", req.user?.id);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.error("❌ [Get Current User] User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ [Get Current User] User found:", user.email);
    res.json({ user });
  } catch (error) {
    console.error("❌ [Get Current User] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Logout - revoke session
 */
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      await prisma.session.deleteMany({
        where: {
          userId: req.user.id,
          token,
        },
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Logout all sessions
 */
const logoutAll = async (req, res) => {
  try {
    await prisma.session.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: "Logged out from all sessions" });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  googleCallback,
  registerEmail,
  verifyEmail,
  getCurrentUser,
  logout,
  logoutAll,
};
