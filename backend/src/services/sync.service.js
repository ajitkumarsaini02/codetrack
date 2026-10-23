const CodingProfile = require("../models/CodingProfile");
const CodingStats = require("../models/CodingStats");
const SyncLog = require("../models/SyncLog");

const { fetchLeetCodeStats } = require("../providers/leetcode.provider");
const { fetchCodeforcesStats } = require("../providers/codeforces.provider");
const { fetchCodeChefStats } = require("../providers/codechef.provider");
const { fetchGFGStats } = require("../providers/gfg.provider");
const { fetchGitHubStats } = require("../providers/github.provider");
const { fetchBatchStats } = require("./codingProfileService");

const providers = {
  leetcode: fetchLeetCodeStats,
  codeforces: fetchCodeforcesStats,
  codechef: fetchCodeChefStats,
  gfg: fetchGFGStats,
  github: fetchGitHubStats,
};

const syncUserPlatforms = async (userId) => {
  const profiles = await CodingProfile.find({ user: userId });
  const results = [];

  if (!profiles.length) {
    return {
      total: 0,
      successful: 0,
      failed: 0,
      results: [],
    };
  }

  // Attempt batch lookup first to fetch all platforms in a single parallel query
  let batchMap = new Map();
  try {
    const platformsMap = {};
    for (const p of profiles) {
      if (providers[p.platform] && p.username) {
        platformsMap[p.platform] = p.username;
      }
    }

    if (Object.keys(platformsMap).length > 0) {
      const batchStatsList = await fetchBatchStats(platformsMap);
      for (const item of batchStatsList) {
        if (item && item.platform) {
          batchMap.set(item.platform.toLowerCase(), item);
        }
      }
    }
  } catch (batchErr) {
    console.warn(
      "Batch platform sync failed, falling back to individual providers:",
      batchErr.message,
    );
  }

  for (const profile of profiles) {
    const platform = profile.platform.toLowerCase();
    const fetchStats = providers[platform];

    if (!fetchStats) continue;

    const log = await SyncLog.create({
      user: userId,
      platform,
      status: "started",
      startedAt: new Date(),
    });

    try {
      // Use batch result if available, else fetch individually
      let stats = batchMap.get(platform);
      if (!stats) {
        stats = await fetchStats(profile.username);
      }

      if (stats.supported === false) {
        profile.syncStatus = "failed";
        profile.syncError = stats.message || "Platform not supported";
        await profile.save();

        log.status = "failed";
        log.message = stats.message || "Platform not supported";
        log.completedAt = new Date();
        await log.save();

        results.push({
          platform,
          success: false,
          message: stats.message,
        });

        continue;
      }

      const updatedStats = await CodingStats.findOneAndUpdate(
        { user: userId, platform },
        {
          user: userId,
          platform,
          totalSolved: Number(stats.totalSolved || 0),
          easySolved: Number(stats.easySolved || 0),
          mediumSolved: Number(stats.mediumSolved || 0),
          hardSolved: Number(stats.hardSolved || 0),
          rating: Number(stats.rating || 0),
          maxRating: Number(stats.maxRating || stats.rating || 0),
          globalRank: stats.globalRank || null,
          countryRank: stats.countryRank || null,
          contestsParticipated: Number(stats.contestsParticipated || 0),
          stars: Number(stats.stars || 0),
          streak: Number(stats.streak || 0),
          badges: Array.isArray(stats.badges) ? stats.badges : [],
          certifications: Number(stats.certifications || 0),
          details: stats.details || {},
          lastUpdated: new Date(),
        },
        { upsert: true, new: true, runValidators: true },
      );

      profile.syncStatus = "success";
      profile.syncError = "";
      profile.lastSyncedAt = new Date();
      await profile.save();

      log.status = "success";
      log.message = "Statistics synchronized successfully";
      log.completedAt = new Date();
      await log.save();

      results.push({
        platform,
        success: true,
        stats: updatedStats,
      });
    } catch (error) {
      profile.syncStatus = "failed";
      profile.syncError = error.message;
      await profile.save();

      log.status = "failed";
      log.message = error.message;
      log.completedAt = new Date();
      await log.save();

      results.push({
        platform,
        success: false,
        message: error.message,
      });
    }
  }

  return {
    total: profiles.length,
    successful: results.filter((item) => item.success).length,
    failed: results.filter((item) => !item.success).length,
    results,
  };
};

/**
 * Sync a single platform for a user
 * @param {string} userId
 * @param {string} platform  e.g. "leetcode"
 */
const syncSinglePlatform = async (userId, platform) => {
  const normalizedPlatform = platform.toLowerCase().trim();
  const fetchStats = providers[normalizedPlatform];

  if (!fetchStats) {
    throw new Error(`Unsupported platform: ${normalizedPlatform}`);
  }

  const profile = await CodingProfile.findOne({
    user: userId,
    platform: normalizedPlatform,
  });

  if (!profile) {
    throw new Error(
      `No ${normalizedPlatform} profile linked. Please add it first.`,
    );
  }

  const log = await SyncLog.create({
    user: userId,
    platform: normalizedPlatform,
    status: "started",
    startedAt: new Date(),
  });

  try {
    const stats = await fetchStats(profile.username);

    if (stats.supported === false) {
      profile.syncStatus = "failed";
      profile.syncError = stats.message || "Platform not supported";
      await profile.save();
      log.status = "failed";
      log.message = stats.message || "Platform not supported";
      log.completedAt = new Date();
      await log.save();
      throw new Error(stats.message || "Platform not supported");
    }

    const updatedStats = await CodingStats.findOneAndUpdate(
      { user: userId, platform: normalizedPlatform },
      {
        user: userId,
        platform: normalizedPlatform,
        totalSolved: Number(stats.totalSolved || 0),
        easySolved: Number(stats.easySolved || 0),
        mediumSolved: Number(stats.mediumSolved || 0),
        hardSolved: Number(stats.hardSolved || 0),
        rating: Number(stats.rating || 0),
        maxRating: Number(stats.maxRating || stats.rating || 0),
        globalRank: stats.globalRank || null,
        countryRank: stats.countryRank || null,
        contestsParticipated: Number(stats.contestsParticipated || 0),
        stars: Number(stats.stars || 0),
        streak: Number(stats.streak || 0),
        badges: Array.isArray(stats.badges)
          ? stats.badges.map((b) => (typeof b === "string" ? b : b.name || "Badge"))
          : [],
        certifications: Number(stats.certifications || 0),
        details: stats.details || {},
        lastUpdated: new Date(),
      },
      { upsert: true, new: true, runValidators: true },
    );

    profile.syncStatus = "success";
    profile.syncError = "";
    profile.lastSyncedAt = new Date();
    await profile.save();

    log.status = "success";
    log.message = "Statistics synchronized successfully";
    log.completedAt = new Date();
    await log.save();

    return { platform: normalizedPlatform, success: true, stats: updatedStats };
  } catch (error) {
    profile.syncStatus = "failed";
    profile.syncError = error.message;
    await profile.save();

    log.status = "failed";
    log.message = error.message;
    log.completedAt = new Date();
    await log.save();

    throw error;
  }
};

module.exports = { syncUserPlatforms, syncSinglePlatform };

