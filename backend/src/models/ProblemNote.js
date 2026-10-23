const mongoose = require("mongoose");

const problemNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    codeSnippet: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

problemNoteSchema.index({ user: 1, problem: 1 });

module.exports = mongoose.model("ProblemNote", problemNoteSchema);
