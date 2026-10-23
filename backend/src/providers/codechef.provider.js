const { fetchSingleStats } = require("../services/codingProfileService");

const fetchCodeChefStats = async (username) => {
  if (!username) {
    throw new Error("CodeChef username is required");
  }

  return await fetchSingleStats("codechef", username);
};

module.exports = { fetchCodeChefStats };
