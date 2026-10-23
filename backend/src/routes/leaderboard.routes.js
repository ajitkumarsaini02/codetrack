const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public route to view rankings
router.get("/", leaderboardController.getLeaderboard);

module.exports = router;
