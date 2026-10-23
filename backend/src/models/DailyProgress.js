const mongoose = require("mongoose");

const dailyProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    problemsSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    minutesSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

dailyProgressSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyProgress", dailyProgressSchema);
