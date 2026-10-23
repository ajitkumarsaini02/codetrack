const mongoose = require("mongoose");

const codingProfileSchema = new mongoose.Schema(
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
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profileUrl: {
      type: String,
      default: "",
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    syncStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    syncError: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

codingProfileSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("CodingProfile", codingProfileSchema);
