const DailyProgress = require("../models/DailyProgress");
const Problem = require("../models/Problem");
const CodingStats = require("../models/CodingStats");

const getAnalytics = async (userId) => {
  const [progress, problems, platformStats] = await Promise.all([
    DailyProgress.find({ user: userId }).sort({ date: 1 }).limit(365).lean(),
    Problem.find({ user: userId })
      .select("difficulty status platform topics solvedAt createdAt")
      .lean(),
    CodingStats.find({ user: userId }).lean(),
  ]);

  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const byStatus = { todo: 0, solved: 0, revision: 0 };
  const byTopic = {};

  for (const problem of problems) {
    if (problem.difficulty in byDifficulty) {
      byDifficulty[problem.difficulty]++;
    }

    if (problem.status in byStatus) {
      byStatus[problem.status]++;
    }

    for (const topic of problem.topics || []) {
      byTopic[topic] = (byTopic[topic] || 0) + 1;
    }
  }

  const totalDailySolved = progress.reduce(
    (sum, day) => sum + (day.problemsSolved || 0),
    0,
  );

  const totalPlatformSolved = platformStats.reduce(
    (sum, item) => sum + (item.totalSolved || 0),
    0,
  );

  return {
    totalTrackedProblems: problems.length,
    totalManuallySolved: byStatus.solved,
    totalDailySolved,
    totalPlatformSolved,
    byDifficulty,
    byStatus,
    byTopic,
    dailyProgress: progress,
  };
};

module.exports = { getAnalytics };
