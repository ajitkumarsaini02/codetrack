const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");

const app = express();

app.use(helmet());

const allowedOrigins = (env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

// Health checks
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodeTrack API is running",
  });
});

app.get("/api/health", (req, res) => {
  const isConnected = require("mongoose").connection.readyState === 1;
  res.json({
    success: true,
    status: "OK",
    database: isConnected ? "connected" : "disconnected",
    message: "CodeTrack backend is healthy",
  });
});

// API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/problems", require("./routes/problem.routes"));
app.use("/api/platforms", require("./routes/platform.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/leaderboard", require("./routes/leaderboard.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/revisions", require("./routes/revision.routes"));
app.use("/api/friends", require("./routes/friendship.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/sheets", require("./routes/sheet.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler — must be last
const errorMiddleware = require("./middleware/error.middleware");
app.use(errorMiddleware);

module.exports = app;
