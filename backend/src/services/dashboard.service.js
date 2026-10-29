const CodingStats = require("../models/CodingStats");
const CodingProfile = require("../models/CodingProfile");
const DailyProgress = require("../models/DailyProgress");
const Problem = require("../models/Problem");
const Revision = require("../models/Revision");
const { sheets } = require("../data/sheetsData");

const getDashboard = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [
    stats,
    platforms,
    progress,
    totalProblems,
    solvedProblems,
    todayProblemsCount,
    manualSolvedByDiff,
    upcomingRevisions,
    solvedUserProblems,
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
    Problem.find({
      user: userId,
      status: "solved",
    }).select("title platform"),
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

  // Calculate verified curated sheet questions solved
  let userSolvedTitlesByPlatform = new Map();
  for (const p of solvedUserProblems) {
    let plat = (p.platform || "leetcode").toLowerCase().trim();
    if (plat === "geeksforgeeks") plat = "gfg";
    if (!userSolvedTitlesByPlatform.has(plat)) {
      userSolvedTitlesByPlatform.set(plat, new Set());
    }
    userSolvedTitlesByPlatform.get(plat).add(p.title.toLowerCase().trim());
  }

  let curatedSheetSolved = 0;
  let totalCuratedSheetProblems = 0;

  for (const sheet of sheets) {
    let plat = (sheet.platform || "").toLowerCase().trim();
    if (plat === "geeksforgeeks") plat = "gfg";
    const solvedTitles = userSolvedTitlesByPlatform.get(plat) || new Set();

    for (const phase of sheet.phases) {
      for (const topic of phase.topics) {
        totalCuratedSheetProblems += topic.problems.length;
        for (const prob of topic.problems) {
          if (solvedTitles.has(prob.title.toLowerCase().trim())) {
            curatedSheetSolved++;
          }
        }
      }
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
      curatedSheetSolved,
      totalSheetProblems: totalCuratedSheetProblems || 1447,
      todaySolved,
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
