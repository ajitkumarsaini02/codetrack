// CodeTrack Curated Topic-Wise DSA Sheets
// 1. LeetCode DSA Mastery Sheet (947 Unique Curated Problems, 22 Phases, 115 Topics)
// 2. Codeforces DSA Mastery Sheet (500 Curated Problems, 22 Phases, 116 Topics)

const sheets = require("./sheetsData.json");

const leetcodePhases = sheets.find((s) => s.id === "leetcode")?.phases || [];
const codeforcesPhases =
  sheets.find((s) => s.id === "codeforces")?.phases || [];

module.exports = {
  sheets,
  leetcodePhases,
  codeforcesPhases,
};
