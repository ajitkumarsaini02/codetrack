const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    platform: {
      type: String,
      enum: ["leetcode", "codechef", "codeforces", "gfg", "geeksforgeeks", "other"],
      default: "other",
      set: (v) => {
        if (!v) return "other";
        const val = v.toLowerCase().trim();
        return val === "geeksforgeeks" ? "gfg" : val;
      },
    },
    problemUrl: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    status: {
      type: String,
      enum: ["todo", "attempted", "solved", "revision"],
      default: "todo",
      set: (v) => (typeof v === "string" ? v.toLowerCase() : "todo"),
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

problemSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("Problem", problemSchema);
