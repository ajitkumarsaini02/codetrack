const mongoose = require("mongoose");

const syncLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["leetcode", "codechef", "codeforces", "gfg", "github"],
      required: true,
    },
    status: {
      type: String,
      enum: ["started", "success", "failed"],
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

syncLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SyncLog", syncLogSchema);
