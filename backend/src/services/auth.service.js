const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const createToken = (userId) => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const signOptions = {};
  if (env.JWT_EXPIRES_IN && env.JWT_EXPIRES_IN !== "never") {
    signOptions.expiresIn = env.JWT_EXPIRES_IN;
  }

  return jwt.sign({ id: userId }, env.JWT_SECRET, signOptions);
};

const register = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    const error = new Error("Name, username, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must contain at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existing) {
    const error = new Error("Email or username is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
    token: createToken(user._id),
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
    token: createToken(user._id),
  };
};

module.exports = { register, login, createToken };
