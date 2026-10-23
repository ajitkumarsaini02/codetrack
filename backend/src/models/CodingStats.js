const mongoose = require("mongoose");

const codingStatsSchema = new mongoose.Schema(
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
    totalSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    maxRating: {
      type: Number,
      default: 0,
    },
    globalRank: {
      type: Number,
      default: null,
    },
    countryRank: {
      type: Number,
      default: null,
    },
    contestsParticipated: {
      type: Number,
      default: 0,
    },
    stars: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    certifications: {
      type: Number,
      default: 0,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

codingStatsSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("CodingStats", codingStatsSchema);
