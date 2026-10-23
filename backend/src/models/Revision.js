const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending",
    },
  },
  { timestamps: true },
);

revisionSchema.index({ user: 1, scheduledAt: 1 });

module.exports = mongoose.model("Revision", revisionSchema);
