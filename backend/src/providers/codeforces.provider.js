const { fetchSingleStats } = require("../services/codingProfileService");

const ENDPOINT = "https://codeforces.com/api";

const fetchDirectCodeforces = async (username) => {
  const response = await fetch(
    `${ENDPOINT}/user.info?handles=${encodeURIComponent(username)}`,
    { signal: AbortSignal.timeout(10000) },
  );

  if (!response.ok) {
    throw new Error(`Codeforces request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== "OK" || !result.result?.length) {
    throw new Error(result.comment || "Codeforces user not found");
  }

  const user = result.result[0];

  let problems = [];
  try {
    const submissionsResponse = await fetch(
      `${ENDPOINT}/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`,
      { signal: AbortSignal.timeout(15000) },
    );

    if (submissionsResponse.ok) {
      const submissions = await submissionsResponse.json();
      if (submissions.status === "OK") {
        const solved = new Map();
        for (const submission of submissions.result) {
          if (submission.verdict !== "OK" || !submission.problem) continue;
          const problem = submission.problem;
          const key = `${problem.contestId ?? ""}-${problem.index ?? ""}-${problem.name ?? ""}`;
          solved.set(key, problem);
        }
        problems = [...solved.values()];
      }
    }
  } catch (err) {
    console.warn("Could not fetch detailed Codeforces submissions:", err.message);
  }

  return {
    platform: "codeforces",
    username: user.handle,
    totalSolved: problems.length,
    easySolved: problems.filter((p) => (p.rating || 0) <= 1200).length,
    mediumSolved: problems.filter(
      (p) => (p.rating || 0) > 1200 && (p.rating || 0) <= 2000,
    ).length,
    hardSolved: problems.filter((p) => (p.rating || 0) > 2000).length,
    rating: user.rating || 0,
    maxRating: user.maxRating || user.rating || 0,
    globalRank: null,
    contestsParticipated: 0,
    details: { fallback: true },
  };
};

const fetchCodeforcesStats = async (username) => {
  if (!username) {
    throw new Error("Codeforces username is required");
  }

  try {
    return await fetchSingleStats("codeforces", username);
  } catch (serviceErr) {
    console.warn(
      `Live coding-profile-service error for Codeforces (${username}):`,
      serviceErr.message,
      "— Falling back to direct Codeforces API",
    );
    return await fetchDirectCodeforces(username);
  }
};

module.exports = { fetchCodeforcesStats };
