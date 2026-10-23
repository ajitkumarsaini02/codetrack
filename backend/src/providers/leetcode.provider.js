const { fetchSingleStats } = require("../services/codingProfileService");

const ENDPOINT = "https://leetcode.com/graphql";

const fetchDirectLeetCode = async (username) => {
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
    }
  `;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CodeTrack/2.0",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`LeetCode request failed: ${response.status}`);
  }

  const result = await response.json();
  const user = result.data?.matchedUser;

  if (!user) {
    throw new Error("LeetCode user not found or profile unavailable");
  }

  const counts = user.submitStats?.acSubmissionNum || [];
  const getCount = (difficulty) =>
    counts.find((item) => item.difficulty === difficulty)?.count || 0;

  const contest = result.data?.userContestRanking;

  return {
    platform: "leetcode",
    username: user.username,
    totalSolved: getCount("All"),
    easySolved: getCount("Easy"),
    mediumSolved: getCount("Medium"),
    hardSolved: getCount("Hard"),
    rating: contest?.rating ? Math.round(contest.rating) : 0,
    maxRating: contest?.rating ? Math.round(contest.rating) : 0,
    globalRank: contest?.globalRanking || user.profile?.ranking || null,
    contestsParticipated: 0,
    details: { fallback: true },
  };
};

const fetchLeetCodeStats = async (username) => {
  if (!username) {
    throw new Error("LeetCode username is required");
  }

  try {
    return await fetchSingleStats("leetcode", username);
  } catch (serviceErr) {
    console.warn(
      `Live coding-profile-service error for LeetCode (${username}):`,
      serviceErr.message,
      "— Falling back to direct LeetCode GraphQL",
    );
    return await fetchDirectLeetCode(username);
  }
};

module.exports = { fetchLeetCodeStats };
