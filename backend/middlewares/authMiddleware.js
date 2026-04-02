const { verifyToken } = require("../services/jwt");
const prisma = require("../config/prisma");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    console.log("🔐 [Auth Middleware] Authenticating request...");
    console.log("   Authorization header:", authHeader ? "✅ Present" : "❌ Missing");
    console.log("   Token:", token ? "✅ Yes" : "❌ No");
    
    if (!token) {
      console.error("❌ [Auth Middleware] No token provided");
      return res.status(401).json({ message: "Access token required!" });
    }

    const decoded = verifyToken(token);
    console.log("✅ [Auth Middleware] Token verified, User ID:", decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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
      console.error("❌ [Auth Middleware] User not found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found!" });
    }

    console.log("✅ [Auth Middleware] User authenticated:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ [Auth Middleware] Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token!" });
  }
};

const requireAdmin = (req, res, next) => {
  // TODO: Add role field to User schema
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({
  //     message: "Admin access required!",
  //     requiredRole: "admin",
  //     userRole: req.user.role,
  //   });
  // }
  next();
};

const requireVerified = (req, res, next) => {
  // TODO: Add isVerified field to User schema
  // if (!req.user.isVerified) {
  //   return res.status(403).json({ message: "Account verification required!" });
  // }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    // TODO: Add role field to User schema
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     message: "Insufficient permissions!",
    //     requiredRoles: roles,
    //     userRole: req.user.role,
    //   });
    // }
    next();
  };
};

const requireOwnershipOrAdmin = (userIdField = "userId") => {
  return (req, res, next) => {
    const resourceUserId = req.params[userIdField] || req.body[userIdField];

    // TODO: Add role field to User schema
    if (req.user.id === resourceUserId) {
      next();
    } else {
      return res.status(403).json({
        message:
          "You can only access your own resources!",
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  isAdmin: requireAdmin,
  requireVerified,
  requireRole,
  requireOwnershipOrAdmin,
};