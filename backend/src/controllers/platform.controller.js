const {
  syncUserPlatforms,
  syncSinglePlatform,
} = require("../services/sync.service");
const CodingProfile = require("../models/CodingProfile");
const CodingStats = require("../models/CodingStats");

const getProfileUrl = (platform, username) => {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return `https://leetcode.com/${username}/`;
    case "codeforces":
      return `https://codeforces.com/profile/${username}`;
    case "codechef":
      return `https://www.codechef.com/users/${username}`;
    case "gfg":
      return `https://www.geeksforgeeks.org/user/${username}/`;
    case "github":
      return `https://github.com/${username}`;
    default:
      return "";
  }
};

const getPlatforms = async (req, res, next) => {
  try {
    const platforms = await CodingProfile.find({
      user: req.user._id,
    });

    res.json({ success: true, data: platforms });
  } catch (error) {
    next(error);
  }
};

const addPlatform = async (req, res, next) => {
  try {
    const { platform, username, profileUrl } = req.body;

    if (!platform || !username) {
      return res.status(400).json({
        success: false,
        message: "Platform and username are required",
      });
    }

    const normalizedPlatform = platform.toLowerCase().trim();
    const allowed = ["leetcode", "codechef", "codeforces", "gfg", "github"];

    if (!allowed.includes(normalizedPlatform)) {
      return res.status(400).json({
        success: false,
        message: `Invalid platform. Allowed values: ${allowed.join(", ")}`,
      });
    }

    const url =
      (profileUrl && profileUrl.trim()) ||
      getProfileUrl(normalizedPlatform, username.trim());

    const profile = await CodingProfile.findOneAndUpdate(
      { user: req.user._id, platform: normalizedPlatform },
      {
        user: req.user._id,
        platform: normalizedPlatform,
        username: username.trim(),
        profileUrl: url,
        syncStatus: "pending",
        syncError: "",
      },
      { upsert: true, new: true, runValidators: true },
    );

    // Automatically trigger background sync for the user
    syncUserPlatforms(req.user._id).catch((err) => {
      console.error(`Auto-sync failed for ${normalizedPlatform}:`, err.message);
    });

    res.status(201).json({
      success: true,
      message: `${normalizedPlatform} profile linked successfully`,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const deletePlatform = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support deletion by ObjectId or by platform name
    const query = { user: req.user._id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.platform = id.toLowerCase();
    }

    const profile = await CodingProfile.findOneAndDelete(query);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Platform profile not found",
      });
    }

    // Clean up corresponding stats
    await CodingStats.findOneAndDelete({
      user: req.user._id,
      platform: profile.platform,
    });

    res.json({
      success: true,
      message: `${profile.platform} profile removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const syncPlatforms = async (req, res, next) => {
  try {
    const result = await syncUserPlatforms(req.user._id);

    res.json({
      success: true,
      message: "Platform sync completed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const syncOnePlatform = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const result = await syncSinglePlatform(req.user._id, platform);

    res.json({
      success: true,
      message: `${platform} sync completed`,
      data: result.stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatforms,
  addPlatform,
  deletePlatform,
  syncPlatforms,
  syncOnePlatform,
};
