require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const mailRoutes = require("./routes/mailRoutes");

const app = express();

// --- Allowed origins ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

// --- CORS Middleware ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());

// --- Routes ---
console.log("📌 [App] Mounting /auth routes...");
app.use("/auth", authRoutes);
console.log("✅ [App] /auth routes mounted");

console.log("📌 [App] Mounting /mail routes...");
app.use("/mail", mailRoutes);
console.log("✅ [App] /mail routes mounted");

app.get("/", (req, res) => {
  res.send("API is Running!");
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  // Handle Multer-specific errors
  if (err.name === "MulterError") {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum allowed size is 10 MB."
        : err.message;
    return res.status(400).json({ success: false, message: msg });
  }

  // Handle file-type rejection from fileFilter
  if (err.message?.startsWith("File type")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  const statusCode =
    err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;