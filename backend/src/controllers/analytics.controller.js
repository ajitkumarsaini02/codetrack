const analyticsService = require("../services/analytics.service");

const getAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalytics(req.user._id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
