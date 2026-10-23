const { fetchSingleStats } = require("../services/codingProfileService");

const fetchGFGStats = async (username) => {
  if (!username) {
    throw new Error("GeeksforGeeks username is required");
  }

  return await fetchSingleStats("gfg", username);
};

module.exports = { fetchGFGStats };
