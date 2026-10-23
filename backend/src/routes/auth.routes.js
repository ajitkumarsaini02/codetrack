const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
