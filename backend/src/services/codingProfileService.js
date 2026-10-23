/**
 * Coding Profile Service Client
 * Connects to live service: https://coding-profile-service-v2-0.onrender.com/
 * GitHub: https://github.com/mearjuntripathi/coding-profile-service-v2.0
 *
 * Provides real-time scraping & cached statistics for:
 * - LeetCode (solved, rating, maxRating, globalRank, contests, difficulty breakdown)
 * - CodeChef (solved, rating, maxRating, stars, global/country rank, contests)
 * - Codeforces (solved, rating, maxRating, contests, easy/medium/hard breakdown)
 * - GeeksforGeeks (solved, streak, maxRating, easy/medium/hard breakdown)
 */

const BASE_URL =
  process.env.CODING_PROFILE_SERVICE_URL ||
  "https://coding-profile-service-v2-0.onrender.com";

const REQUEST_TIMEOUT_MS = 25000;

/**
 * Normalizes raw stats from coding-profile-service into consistent schema
 */
const normalizeStats = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const platform = String(raw.platform || "").toLowerCase();
  const username = String(raw.username || "");

  const easySolved = Number(
    raw.easySolved ?? raw.questionsByType?.easy ?? 0,
  );
  const mediumSolved = Number(
    raw.mediumSolved ?? raw.questionsByType?.medium ?? 0,
  );
  const hardSolved = Number(
    raw.hardSolved ?? raw.questionsByType?.hard ?? 0,
  );

  const totalSolved = Number(raw.totalSolved ?? easySolved + mediumSolved + hardSolved ?? 0);
  const rating = Number(raw.rating || 0);
  const maxRating = Number(raw.maxRating || rating || 0);
  const contestsParticipated = Number(raw.contestsParticipated || 0);
  const stars = Number(raw.stars || 0);
  const streak = Number(raw.streak || 0);
  const globalRank = raw.globalRank != null && raw.globalRank !== "" ? Number(raw.globalRank) : null;
  const countryRank = raw.countryRank != null && raw.countryRank !== "" ? Number(raw.countryRank) : null;

  const badges = Array.isArray(raw.badges) ? raw.badges : [];
  const certifications = Number(raw.certifications || 0);

  return {
    platform,
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    rating,
    maxRating,
    globalRank,
    countryRank,
    contestsParticipated,
    stars,
    streak,
    badges,
    certifications,
    details: {
      cached: Boolean(raw.cached),
      certificationLinks: Array.isArray(raw.certificationLinks)
        ? raw.certificationLinks
        : [],
      questionsByType: raw.questionsByType || null,
    },
  };
};

/**
 * Fetch stats for multiple platforms in a single parallel query
 * @param {Object} platformsMap e.g. { leetcode: "neal_wu", codeforces: "tourist" }
 */
const fetchBatchStats = async (platformsMap = {}) => {
  const queryParams = new URLSearchParams();

  for (const [platform, username] of Object.entries(platformsMap)) {
    if (username && username.trim()) {
      queryParams.set(platform.toLowerCase().trim(), username.trim());
    }
  }

  const queryString = queryParams.toString();
  if (!queryString) return [];

  const url = `${BASE_URL}/stats?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "CodeTrack/2.0",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Coding profile service returned HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();
  const profiles = Array.isArray(data?.profiles) ? data.profiles : [];

  return profiles
    .filter((item) => item && !item.error && item.platform)
    .map(normalizeStats);
};

/**
 * Fetch stats for a single platform & username
 * @param {string} platform
 * @param {string} username
 */
const fetchSingleStats = async (platform, username) => {
  if (!platform || !username) {
    throw new Error("Platform and username are required");
  }

  const normalizedPlatform = platform.toLowerCase().trim();
  const trimmedUser = username.trim();

  const url = `${BASE_URL}/stats?${encodeURIComponent(normalizedPlatform)}=${encodeURIComponent(trimmedUser)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "CodeTrack/2.0",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Coding profile service returned HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();
  const profiles = Array.isArray(data?.profiles) ? data.profiles : [];

  const match = profiles.find(
    (p) =>
      p &&
      p.platform &&
      p.platform.toLowerCase() === normalizedPlatform,
  );

  if (!match) {
    const errItem = profiles.find((p) => p?.error);
    if (errItem) {
      throw new Error(`Profile lookup failed: ${errItem.error}`);
    }
    throw new Error(
      `No statistics returned for ${normalizedPlatform} user "${trimmedUser}"`,
    );
  }

  if (match.error) {
    throw new Error(`Profile lookup failed: ${match.error}`);
  }

  return normalizeStats(match);
};

module.exports = {
  BASE_URL,
  normalizeStats,
  fetchBatchStats,
  fetchSingleStats,
};
