/**
 * GitHub Provider
 * Fetches real-time statistics from the GitHub REST API:
 * - Public Repositories (mapped to total projects)
 * - Total Stars earned across all repositories
 * - Followers & Following count
 * - Forks & Gists count
 * - Bio and Profile details
 */

const fetchGitHubStats = async (username) => {
  if (!username) {
    throw new Error("GitHub username is required");
  }

  const cleanUser = username.trim();
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CodeTrack/2.0",
  };

  const githubToken = process.env.GITHUB_TOKEN?.trim();
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const userResponse = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUser)}`,
    {
      headers,
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error(`GitHub user "${cleanUser}" not found`);
    }

    if (userResponse.status === 403) {
      const remaining = userResponse.headers.get("x-ratelimit-remaining");
      const reset = userResponse.headers.get("x-ratelimit-reset");
      let resetMsg = "";
      if (reset) {
        const resetTime = new Date(Number(reset) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        resetMsg = ` (resets around ${resetTime})`;
      }

      let errorDetail = "";
      try {
        const errJson = await userResponse.json();
        if (errJson?.message) {
          errorDetail = errJson.message;
        }
      } catch {
        // ignore parse error
      }

      if (remaining === "0" || errorDetail.toLowerCase().includes("rate limit")) {
        throw new Error(
          `GitHub API rate limit reached${resetMsg}. Add a free GITHUB_TOKEN in backend/.env to increase limit to 5,000 req/hr.`,
        );
      }

      throw new Error(
        errorDetail
          ? `GitHub API error (403): ${errorDetail}`
          : `GitHub API request failed with status: 403`,
      );
    }

    throw new Error(
      `GitHub API request failed with status: ${userResponse.status}`,
    );
  }

  const user = await userResponse.json();

  let totalStars = 0;
  let totalForks = 0;

  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&type=owner`,
      {
        headers,
        signal: AbortSignal.timeout(10000),
      },
    );

    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      if (Array.isArray(repos)) {
        totalStars = repos.reduce(
          (sum, repo) => sum + (repo.stargazers_count || 0),
          0,
        );
        totalForks = repos.reduce(
          (sum, repo) => sum + (repo.forks_count || 0),
          0,
        );
      }
    }
  } catch (repoErr) {
    console.warn("Could not calculate GitHub stars/forks:", repoErr.message);
  }

  return {
    platform: "github",
    username: user.login,
    totalSolved: Number(user.public_repos || 0),
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    rating: totalStars,
    maxRating: totalStars,
    globalRank: user.followers ? Number(user.followers) : null,
    countryRank: null,
    contestsParticipated: 0,
    stars: totalStars,
    streak: 0,
    badges: [],
    certifications: 0,
    details: {
      name: user.name || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
      public_repos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      public_gists: user.public_gists || 0,
      totalStars,
      totalForks,
    },
  };
};

module.exports = { fetchGitHubStats };
