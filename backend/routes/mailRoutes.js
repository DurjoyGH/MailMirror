const express = require("express");
const {
  getMailMessages,
  createShareLink,
  getShareLinks,
  toggleShareLink,
} = require("../controllers/mailController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// All mail routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /mail/messages
 * @desc    Get user's Gmail messages
 * @access  Private
 */
router.get("/messages", getMailMessages);

/**
 * @route   POST /mail/share
 * @desc    Create a share link
 * @access  Private
 */
router.post("/share", createShareLink);

/**
 * @route   GET /mail/share
 * @desc    Get user's share links
 * @access  Private
 */
router.get("/share", getShareLinks);

/**
 * @route   PATCH /mail/share/:linkId
 * @desc    Toggle share link status
 * @access  Private
 */
router.patch("/share/:linkId", toggleShareLink);

module.exports = router;
