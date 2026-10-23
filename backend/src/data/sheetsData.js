// CodeTrack Curated Topic-Wise DSA Sheets
// Auto-generated from user-provided master sheets:
// 1. LeetCode DSA Complete Roadmap (1,000 Unique Problems, 23 Phases, 105 Topics)
// 2. Codeforces DSA Mastery Sheet (500 Curated Problems, 22 Phases, 116 Topics)
// 3. GeeksforGeeks DSA Mastery Sheet (500 Curated Problems, 22 Phases, 116 Topics)
// 4. LeetCode 1,160 10-per-Topic Mastery (1,160 Problems, 22 Phases, 116 Topics)

const sheets = require("./sheetsData.json");

const leetcodePhases = sheets.find((s) => s.id === "leetcode")?.phases || [];
const codeforcesPhases =
  sheets.find((s) => s.id === "codeforces")?.phases || [];
const gfgPhases = sheets.find((s) => s.id === "gfg")?.phases || [];

module.exports = {
  sheets,
  leetcodePhases,
  codeforcesPhases,
  gfgPhases,
};
