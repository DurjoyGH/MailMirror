const express = require("express");
const {
  googleCallback,
  registerEmail,
  verifyEmail,
  getCurrentUser,
  logout,
  logoutAll,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Log all incoming requests to auth routes
router.use((req, res, next) => {
  console.log(`📍 [Auth Route] ${req.method} ${req.path}`, {
    query: req.query,
    body: req.body ? "✅ Has body" : "❌ No body",
  });
  next();
});

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get("/google/callback", googleCallback);

/**
 * @route   POST /auth/register/email
 * @desc    Register with email and name
 * @access  Public
 * @body    { email: string, name: string }
 */
router.post("/register/email", registerEmail);

/**
 * @route   POST /auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 * @body    { email: string, token: string }
 */
router.post("/verify-email", verifyEmail);

/**
 * @route   GET /auth/me
 * @desc    Get current authenticated user
 * @access  Private
 * @headers { Authorization: "Bearer <token>" }
 */
router.get("/me", authenticateToken, getCurrentUser);

/**
 * @route   POST /auth/logout
 * @desc    Logout current session
 * @access  Private
 * @headers { Authorization: "Bearer <token>" }
 */
router.post("/logout", authenticateToken, logout);

/**
 * @route   POST /auth/logout-all
 * @desc    Logout all sessions
 * @access  Private
 * @headers { Authorization: "Bearer <token>" }
 */
router.post("/logout-all", authenticateToken, logoutAll);

module.exports = router;
