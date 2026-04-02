require("dotenv").config();
require("colors");

const app = require("./app");

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================".rainbow);
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`.cyan);
  console.log("====================================".rainbow);
  console.log("");
  console.log("📖 API Endpoints:".yellow);
  console.log(`   GET  http://localhost:${PORT}/`.cyan);
  console.log(`   POST http://localhost:${PORT}/auth/register/email`.cyan);
  console.log(`   POST http://localhost:${PORT}/auth/verify-email`.cyan);
  console.log(`   GET  http://localhost:${PORT}/auth/me`.cyan);
  console.log(`   POST http://localhost:${PORT}/auth/logout`.cyan);
  console.log("");
  console.log("🔐 Google OAuth:".yellow);
  console.log(`   Callback: http://localhost:${PORT}/auth/google/callback`.cyan);
  console.log(`   Registered in Google Console: ✅`.green);
  console.log("");
});