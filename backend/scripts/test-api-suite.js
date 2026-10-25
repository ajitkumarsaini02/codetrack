const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const env = require("../src/config/env");

const { fetchLeetCodeStats } = require("../src/providers/leetcode.provider");
const { fetchCodeforcesStats } = require("../src/providers/codeforces.provider");
const { fetchCodeChefStats } = require("../src/providers/codechef.provider");
const { fetchGFGStats } = require("../src/providers/gfg.provider");
const { fetchGitHubStats } = require("../src/providers/github.provider");

async function runApiAudit() {
  console.log("=========================================");
  console.log("       CODETRACK FULL API AUDIT          ");
  console.log("=========================================\n");

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    items: [],
  };

  const record = (category, name, status, details = "") => {
    results.items.push({ category, name, status, details });
    if (status === "PASS") results.passed++;
    else if (status === "FAIL") results.failed++;
    else if (status === "WARN") results.warnings++;
    const icon = status === "PASS" ? "✅" : status === "WARN" ? "⚠️" : "❌";
    console.log(`${icon} [${category}] ${name}: ${status}${details ? ` -> ${details}` : ""}`);
  };

  // 1. Database Connection
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    record("Database", "MongoDB Connection", "PASS", "Connected to " + env.MONGODB_URI);
  } catch (err) {
    record("Database", "MongoDB Connection", "FAIL", err.message);
  }

  // 2. Health & Base Routes
  try {
    const res = await request(app).get("/");
    if (res.status === 200 && res.body.success) {
      record("Core API", "GET / (Root endpoint)", "PASS", res.body.message);
    } else {
      record("Core API", "GET /", "FAIL", `Status ${res.status}`);
    }
  } catch (err) {
    record("Core API", "GET /", "FAIL", err.message);
  }

  try {
    const res = await request(app).get("/api/health");
    if (res.status === 200 && res.body.database === "connected") {
      record("Core API", "GET /api/health", "PASS", `Status: ${res.body.status}, DB: ${res.body.database}`);
    } else {
      record("Core API", "GET /api/health", "WARN", `DB status: ${res.body.database}`);
    }
  } catch (err) {
    record("Core API", "GET /api/health", "FAIL", err.message);
  }

  // 3. Sheets Route
  try {
    const res = await request(app).get("/api/sheets");
    if (res.status === 200 && res.body.success) {
      record("Sheets API", "GET /api/sheets", "PASS", `Total sheets: ${res.body.data?.length || 0}`);
    } else {
      record("Sheets API", "GET /api/sheets", "FAIL", `Status ${res.status}`);
    }
  } catch (err) {
    record("Sheets API", "GET /api/sheets", "FAIL", err.message);
  }

  try {
    const res = await request(app).get("/api/sheets/leetcode");
    if (res.status === 200 && res.body.success) {
      record("Sheets API", "GET /api/sheets/leetcode", "PASS", "Phase & topics loaded");
    } else {
      record("Sheets API", "GET /api/sheets/leetcode", "FAIL", `Status ${res.status}`);
    }
  } catch (err) {
    record("Sheets API", "GET /api/sheets/leetcode", "FAIL", err.message);
  }

  // 4. Auth Lifecycle
  const testEmail = `test_audit_${Date.now()}@example.com`;
  const testUsername = `user_${Date.now()}`;
  const testPassword = "Password123!";
  let authToken = null;
  let userId = null;

  try {
    const regRes = await request(app).post("/api/auth/register").send({
      name: "API Audit Test",
      username: testUsername,
      email: testEmail,
      password: testPassword,
    });
    if (regRes.status === 201 || regRes.status === 200) {
      authToken = regRes.body.token || regRes.body.data?.token;
      userId = regRes.body.user?._id || regRes.body.data?.user?.id;
      record("Auth API", "POST /api/auth/register", "PASS", `User created: ${testUsername}`);
    } else {
      record("Auth API", "POST /api/auth/register", "FAIL", JSON.stringify(regRes.body));
    }
  } catch (err) {
    record("Auth API", "POST /api/auth/register", "FAIL", err.message);
  }

  try {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });
    if (loginRes.status === 200 && (loginRes.body.token || loginRes.body.data?.token)) {
      if (!authToken) authToken = loginRes.body.token || loginRes.body.data?.token;
      record("Auth API", "POST /api/auth/login", "PASS", "Successfully logged in and received JWT");
    } else {
      record("Auth API", "POST /api/auth/login", "FAIL", JSON.stringify(loginRes.body));
    }
  } catch (err) {
    record("Auth API", "POST /api/auth/login", "FAIL", err.message);
  }

  if (authToken) {
    try {
      const meRes = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);
      if (meRes.status === 200 && meRes.body.success) {
        record("Auth API", "GET /api/auth/me", "PASS", `User profile loaded for ${meRes.body.data?.user?.email || meRes.body.user?.email}`);
      } else {
        record("Auth API", "GET /api/auth/me", "FAIL", `Status ${meRes.status}`);
      }
    } catch (err) {
      record("Auth API", "GET /api/auth/me", "FAIL", err.message);
    }

    // 5. Authenticated Endpoints
    try {
      const dashRes = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${authToken}`);
      if (dashRes.status === 200 && dashRes.body.success) {
        record("Dashboard API", "GET /api/dashboard", "PASS", "Dashboard data loaded");
      } else {
        record("Dashboard API", "GET /api/dashboard", "FAIL", JSON.stringify(dashRes.body));
      }
    } catch (err) {
      record("Dashboard API", "GET /api/dashboard", "FAIL", err.message);
    }

    try {
      const analyticsRes = await request(app)
        .get("/api/analytics")
        .set("Authorization", `Bearer ${authToken}`);
      if (analyticsRes.status === 200 && analyticsRes.body.success) {
        record("Analytics API", "GET /api/analytics", "PASS", "Analytics payload loaded");
      } else {
        record("Analytics API", "GET /api/analytics", "FAIL", JSON.stringify(analyticsRes.body));
      }
    } catch (err) {
      record("Analytics API", "GET /api/analytics", "FAIL", err.message);
    }

    try {
      const leaderRes = await request(app)
        .get("/api/leaderboard")
        .set("Authorization", `Bearer ${authToken}`);
      if (leaderRes.status === 200 && leaderRes.body.success) {
        record("Leaderboard API", "GET /api/leaderboard", "PASS", "Leaderboard list retrieved");
      } else {
        record("Leaderboard API", "GET /api/leaderboard", "FAIL", JSON.stringify(leaderRes.body));
      }
    } catch (err) {
      record("Leaderboard API", "GET /api/leaderboard", "FAIL", err.message);
    }

    try {
      const probRes = await request(app)
        .get("/api/problems")
        .set("Authorization", `Bearer ${authToken}`);
      if (probRes.status === 200 && probRes.body.success) {
        record("Problems API", "GET /api/problems", "PASS", `Problems list loaded: ${probRes.body.data?.length || 0}`);
      } else {
        record("Problems API", "GET /api/problems", "FAIL", JSON.stringify(probRes.body));
      }
    } catch (err) {
      record("Problems API", "GET /api/problems", "FAIL", err.message);
    }

    try {
      const revRes = await request(app)
        .get("/api/revisions")
        .set("Authorization", `Bearer ${authToken}`);
      if (revRes.status === 200 && revRes.body.success) {
        record("Revisions API", "GET /api/revisions", "PASS", "Revisions list loaded");
      } else {
        record("Revisions API", "GET /api/revisions", "FAIL", JSON.stringify(revRes.body));
      }
    } catch (err) {
      record("Revisions API", "GET /api/revisions", "FAIL", err.message);
    }

    try {
      const friendRes = await request(app)
        .get("/api/friends")
        .set("Authorization", `Bearer ${authToken}`);
      if (friendRes.status === 200 && friendRes.body.success) {
        record("Friends API", "GET /api/friends", "PASS", "Friends data loaded");
      } else {
        record("Friends API", "GET /api/friends", "FAIL", JSON.stringify(friendRes.body));
      }
    } catch (err) {
      record("Friends API", "GET /api/friends", "FAIL", err.message);
    }

    try {
      const setRes = await request(app)
        .get("/api/settings")
        .set("Authorization", `Bearer ${authToken}`);
      if (setRes.status === 200 && setRes.body.success) {
        record("Settings API", "GET /api/settings", "PASS", "User settings retrieved");
      } else {
        record("Settings API", "GET /api/settings", "FAIL", JSON.stringify(setRes.body));
      }
    } catch (err) {
      record("Settings API", "GET /api/settings", "FAIL", err.message);
    }

    try {
      const platRes = await request(app)
        .get("/api/platforms")
        .set("Authorization", `Bearer ${authToken}`);
      if (platRes.status === 200 && platRes.body.success) {
        record("Platform API", "GET /api/platforms", "PASS", `Platforms linked: ${platRes.body.data?.length || 0}`);
      } else {
        record("Platform API", "GET /api/platforms", "FAIL", JSON.stringify(platRes.body));
      }
    } catch (err) {
      record("Platform API", "GET /api/platforms", "FAIL", err.message);
    }
  }

  // 6. External Platform Providers Live Tests
  console.log("\n--- Testing External Coding Platform Providers ---");
  try {
    const lc = await fetchLeetCodeStats("neal_wu");
    record("External Provider", "LeetCode (neal_wu)", "PASS", `Solved: ${lc.totalSolved}, Rating: ${lc.rating}`);
  } catch (err) {
    record("External Provider", "LeetCode", "FAIL", err.message);
  }

  try {
    const cf = await fetchCodeforcesStats("tourist");
    record("External Provider", "Codeforces (tourist)", "PASS", `Solved: ${cf.totalSolved}, Rating: ${cf.rating}`);
  } catch (err) {
    record("External Provider", "Codeforces", "FAIL", err.message);
  }

  try {
    const gh = await fetchGitHubStats("octocat");
    record("External Provider", "GitHub (octocat)", "PASS", `Repos: ${gh.totalSolved}, Followers: ${gh.globalRank}`);
  } catch (err) {
    record("External Provider", "GitHub", "FAIL", err.message);
  }

  try {
    const cc = await fetchCodeChefStats("tourist");
    record("External Provider", "CodeChef (tourist)", "PASS", `Rating: ${cc.rating}, Stars: ${cc.stars}`);
  } catch (err) {
    record("External Provider", "CodeChef (tourist)", "WARN", `External service error: ${err.message}`);
  }

  try {
    const gfg = await fetchGFGStats("sandeep_jain");
    record("External Provider", "GeeksforGeeks (sandeep_jain)", "PASS", `Username: ${gfg.username}, Total: ${gfg.totalSolved}`);
  } catch (err) {
    record("External Provider", "GeeksforGeeks", "WARN", `External service error: ${err.message}`);
  }

  console.log("\n=========================================");
  console.log(`TOTAL: Passed=${results.passed}, Warnings=${results.warnings}, Failed=${results.failed}`);
  console.log("=========================================\n");

  // Cleanup test user
  if (testEmail) {
    const User = require("../src/models/User");
    await User.deleteOne({ email: testEmail });
  }

  await mongoose.disconnect();
  process.exit(results.failed > 0 ? 1 : 0);
}

runApiAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
