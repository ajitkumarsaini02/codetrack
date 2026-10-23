const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
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
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "problems",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

goalSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model("Goal", goalSchema);
