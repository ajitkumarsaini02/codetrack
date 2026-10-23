const CodingStats = require("../models/CodingStats");
const CodingProfile = require("../models/CodingProfile");
const DailyProgress = require("../models/DailyProgress");
const Problem = require("../models/Problem");
const Revision = require("../models/Revision");

const getDashboard = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    stats,
    platforms,
    progress,
    totalProblems,
    solvedProblems,
    todayProblemsCount,
    manualSolvedByDiff,
    upcomingRevisions,
  ] = await Promise.all([
    CodingStats.find({ user: userId }).lean(),
    CodingProfile.find({ user: userId }).lean(),
    DailyProgress.find({ user: userId }).sort({ date: -1 }).limit(30).lean(),
    Problem.countDocuments({ user: userId }),
    Problem.countDocuments({ user: userId, status: "solved" }),
    Problem.countDocuments({
      user: userId,
      status: "solved",
      solvedAt: { $gte: todayStart },
    }),
    Problem.aggregate([
      { $match: { user: userId, status: "solved" } },
      { $group: { _id: { $toLower: "$difficulty" }, count: { $sum: 1 } } },
    ]),
    Revision.find({
      user: userId,
      status: "pending",
      scheduledAt: { $gte: new Date() },
    })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .lean(),
  ]);

  const totalSolved = stats.reduce((sum, item) => sum + (item.totalSolved || 0), 0);

  const difficulty = stats.reduce(
    (result, item) => {
      result.easy += item.easySolved || 0;
      result.medium += item.mediumSolved || 0;
      result.hard += item.hardSolved || 0;
      return result;
    },
    { easy: 0, medium: 0, hard: 0 },
  );

  const manualDiff = { easy: 0, medium: 0, hard: 0 };
  for (const item of manualSolvedByDiff) {
    if (item._id && manualDiff[item._id] !== undefined) {
      manualDiff[item._id] = item.count;
    }
  }

  const todayDailyRecord = progress.find((p) => p.date === todayStr);
  const todaySolved = Math.max(
    todayProblemsCount,
    todayDailyRecord?.problemsSolved || 0,
  );

  return {
    summary: {
      totalSolved,
      trackedProblems: totalProblems,
      manuallySolved: solvedProblems,
      todaySolved,
      totalSheetProblems: 2498,
      connectedPlatforms: platforms.length,
    },
    difficulty,
    manualDifficulty: manualDiff,
    platforms: stats,
    connectedAccounts: platforms,
    activity: progress.reverse(),
    upcomingRevisions,
  };
};

module.exports = { getDashboard };
