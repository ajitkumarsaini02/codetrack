const { fetchSingleStats } = require("../services/codingProfileService");

const fetchDirectCodeChef = async (username) => {
  const cleanUser = username.trim();
  const url = `https://www.codechef.com/users/${encodeURIComponent(cleanUser)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`CodeChef user "${cleanUser}" not found`);
    }
    throw new Error(`CodeChef request failed with status: ${response.status}`);
  }

  const html = await response.text();

  if (html.includes("User not found") || html.includes("404 Not Found")) {
    throw new Error(`CodeChef user "${cleanUser}" not found`);
  }

  // Rating
  const ratingMatch = html.match(/class="rating-number"[^>]*>\s*([0-9]+)/i);
  const rating = ratingMatch ? Number(ratingMatch[1]) : 0;

  // Highest Rating
  const highestMatch = html.match(/Highest Rating\s*\(?([0-9]+)\)?/i);
  const maxRating = highestMatch ? Number(highestMatch[1]) : rating;

  // Stars
  const starsBlock = html.match(/class="rating-star"[\s\S]*?<\/div>/i);
  let stars = 0;
  if (starsBlock) {
    const starMatches = starsBlock[0].match(/&#9733;|★/g);
    stars = starMatches ? starMatches.length : 0;
  }

  // Global Rank
  const grMatch =
    html.match(/<strong>\s*([0-9]+)\s*<\/strong>\s*<\/a>\s*Global Rank/i) ||
    html.match(/with global rank\s*([0-9]+)/i);
  const globalRank = grMatch ? Number(grMatch[1]) : null;

  // Country Rank
  const crMatch = html.match(
    /<strong>\s*([0-9]+)\s*<\/strong>\s*<\/a>\s*Country Rank/i,
  );
  const countryRank = crMatch ? Number(crMatch[1]) : null;

  // Solved Count
  const solvedMatch =
    html.match(/Total Problems Solved:\s*([0-9]+)/i) ||
    html.match(/Problems Solved[\s\S]*?<h3>([0-9]+)<\/h3>/i);
  const totalSolved = solvedMatch ? Number(solvedMatch[1]) : 0;

  return {
    platform: "codechef",
    username: cleanUser,
    totalSolved,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    rating,
    maxRating,
    globalRank,
    countryRank,
    contestsParticipated: 0,
    stars,
    streak: 0,
    badges: [],
    certifications: 0,
    details: {
      fallback: true,
    },
  };
};

const fetchCodeChefStats = async (username) => {
  if (!username) {
    throw new Error("CodeChef username is required");
  }

  try {
    return await fetchSingleStats("codechef", username);
  } catch (serviceErr) {
    console.warn(
      `Live coding-profile-service error for CodeChef (${username}):`,
      serviceErr.message,
      "— Falling back to direct CodeChef scraping",
    );
    return await fetchDirectCodeChef(username);
  }
};

module.exports = { fetchCodeChefStats, fetchDirectCodeChef };

