const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
