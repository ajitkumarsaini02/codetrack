const { fetchLeetCodeStats } = require("../src/providers/leetcode.provider");

const {
  fetchCodeforcesStats,
} = require("../src/providers/codeforces.provider");

const testProviders = async () => {
  try {
    const leetcode = await fetchLeetCodeStats("YOUR_LEETCODE_USERNAME");
    console.log("LeetCode:", leetcode);
  } catch (error) {
    console.error("LeetCode error:", error.message);
  }

  try {
    const codeforces = await fetchCodeforcesStats("YOUR_CODEFORCES_USERNAME");
    console.log("Codeforces:", codeforces);
  } catch (error) {
    console.error("Codeforces error:", error.message);
  }
};

testProviders();
