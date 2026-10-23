const User = require("../models/User");
const CodingStats = require("../models/CodingStats");

const getLeaderboard = async (query = {}) => {
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const page = Math.max(1, Number(query.page) || 1);

  const users = await User.find({}).select("name username avatar").lean();

  const stats = await CodingStats.find({}).lean();

  const totals = new Map();

  for (const user of users) {
    totals.set(String(user._id), {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      totalSolved: 0,
      rating: 0,
      platforms: 0,
    });
  }

  for (const item of stats) {
    const entry = totals.get(String(item.user));
    if (!entry) continue;

    entry.totalSolved += item.totalSolved || 0;
    entry.rating = Math.max(entry.rating, item.rating || 0);
    entry.platforms++;
  }

  const leaderboard = [...totals.values()].sort(
    (a, b) => b.totalSolved - a.totalSolved,
  );

  leaderboard.forEach((item, index) => {
    item.rank = index + 1;
  });

  const start = (page - 1) * limit;

  return {
    entries: leaderboard.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: leaderboard.length,
      pages: Math.ceil(leaderboard.length / limit),
    },
  };
};

module.exports = { getLeaderboard };
