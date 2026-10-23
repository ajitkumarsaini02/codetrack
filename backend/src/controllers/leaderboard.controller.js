const leaderboardService = require("../services/leaderboard.service");

const getLeaderboard = async (req, res, next) => {
  try {
    const data = await leaderboardService.getLeaderboard(req.query);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
