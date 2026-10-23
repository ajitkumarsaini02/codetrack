const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
    github: {
      type: String,
      default: "",
      trim: true,
    },
    settings: {
      theme: {
        type: String,
        enum: ["dark", "light", "system"],
        default: "dark",
      },
      dailyGoal: {
        type: Number,
        default: 2,
        min: 1,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
