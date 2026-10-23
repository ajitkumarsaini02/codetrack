const syncService = require("../services/sync.service");

const runSyncJob = async (userId) => {
  try {
    return await syncService.syncUserPlatforms(userId);
  } catch (error) {
    console.error("Platform sync job failed:", error.message);
    throw error;
  }
};

module.exports = { runSyncJob };
