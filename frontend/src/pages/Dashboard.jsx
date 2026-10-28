import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ActivityChart from "../components/ActivityChart";
import PlatformCard from "../components/PlatformCard";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { dashboardApi, platformApi } from "../services/api";
import {
  Code2,
  Trophy,
  Flame,
  Target,
  RefreshCw,
  Plus,
  X,
  LogIn,
  CheckCircle2,
} from "lucide-react";

const platformColors = {
  leetcode: "#F59E0B",
  codeforces: "#60A5FA",
  codechef: "#8B5CF6",
  gfg: "#22A06B",
  github: "#9CA3AF",
};

const platformDisplayNames = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  gfg: "GeeksforGeeks",
  github: "GitHub",
};

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [liveDashboard, setLiveDashboard] = useState(null);
  const [livePlatforms, setLivePlatforms] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({
    platform: "leetcode",
    username: "",
  });
  const [linkError, setLinkError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const reloadDashboard = async () => {
    if (!isAuthenticated) return;
    try {
      const [dashRes, platRes] = await Promise.all([
        dashboardApi.getDashboard().catch(() => null),
        platformApi.getPlatforms().catch(() => null),
      ]);

      if (dashRes?.success) {
        setLiveDashboard(dashRes.data);
      }
      if (platRes?.success) {
        setLivePlatforms(platRes.data || []);
      }
    } catch (err) {
      console.warn("Could not load live dashboard data:", err.message);
    }
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!isAuthenticated) return;
      try {
        const [dashRes, platRes] = await Promise.all([
          dashboardApi.getDashboard().catch(() => null),
          platformApi.getPlatforms().catch(() => null),
        ]);

        if (active) {
          if (dashRes?.success) setLiveDashboard(dashRes.data);
          if (platRes?.success) setLivePlatforms(platRes.data || []);
        }
      } catch (err) {
        console.warn("Could not load live dashboard data:", err.message);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const [syncingPlatform, setSyncingPlatform] = useState("");

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await platformApi.syncPlatforms();
      setSyncMessage(res.message || "Platforms synchronized!");
      await reloadDashboard();
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err) {
      setSyncMessage(
        err.response?.data?.message || err.message || "Sync failed",
      );
      setTimeout(() => setSyncMessage(""), 4000);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncPlatform = async (platformName) => {
    if (!platformName || syncingPlatform) return;
    setSyncingPlatform(platformName);
    const displayName = platformDisplayNames[platformName] || platformName;
    setSyncMessage(`Syncing ${displayName}...`);
    try {
      const res = await platformApi.syncPlatform(platformName);
      setSyncMessage(res.message || `${displayName} synchronized!`);
      await reloadDashboard();
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err) {
      setSyncMessage(
        err.response?.data?.message || err.message || `Failed to sync ${displayName}`,
      );
      await reloadDashboard();
      setTimeout(() => setSyncMessage(""), 5000);
    } finally {
      setSyncingPlatform("");
    }
  };

  const handleLinkPlatform = async (e) => {
    e.preventDefault();
    setLinkError("");
    if (!linkData.username.trim()) {
      setLinkError("Username is required");
      return;
    }

    setLinkLoading(true);
    try {
      await platformApi.addPlatform({
        platform: linkData.platform,
        username: linkData.username.trim(),
      });
      setShowLinkModal(false);
      setLinkData({ platform: "leetcode", username: "" });
      await reloadDashboard();
      setSyncMessage("Platform linked successfully!");
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err) {
      setLinkError(
        err.response?.data?.message || err.message || "Failed to link platform",
      );
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDeletePlatform = async (platformId, platformName) => {
    if (!window.confirm(`Unlink ${platformName} account?`)) return;
    try {
      await platformApi.deletePlatform(platformId);
      await reloadDashboard();
      setSyncMessage(`${platformName} unlinked.`);
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err) {
      setSyncMessage(
        err.response?.data?.message || err.message || "Failed to unlink platform",
      );
      setTimeout(() => setSyncMessage(""), 4000);
    }
  };

  // Derive stats cards: use live stats if available, else clean zero state
  const totalSolved = liveDashboard?.summary?.totalSolved ?? 0;
  const trackedProblems = liveDashboard?.summary?.trackedProblems ?? 0;
  const manuallySolved = liveDashboard?.summary?.manuallySolved ?? 0;
  const todaySolved = liveDashboard?.summary?.todaySolved ?? 0;
  const dailyGoal = user?.settings?.dailyGoal || 2;

  // Calculate highest peak rating across all connected platforms
  const highestRating =
    liveDashboard?.platforms?.length > 0
      ? Math.max(
          0,
          ...liveDashboard.platforms.map((s) =>
            Math.max(Number(s.rating || 0), Number(s.maxRating || 0)),
          ),
        )
      : 0;

  const currentStats = [
    {
      id: 1,
      title: "Problems Solved",
      value: totalSolved,
      subtitle: liveDashboard
        ? "Synced across linked profiles"
        : "Total problems completed",
      icon: Code2,
      color: "#D6AD70",
      badge: "All Platforms",
      className: "stat-card-hero",
    },
    {
      id: 2,
      title: "Contest Rating",
      value: highestRating > 0 ? highestRating : "—",
      subtitle: "Peak contest rating",
      icon: Trophy,
      color: "#E3B56C",
      badge: highestRating > 0 ? "Peak" : null,
    },
    {
      id: 3,
      title: "DSA Sheet Solved",
      value: manuallySolved,
      subtitle: `${trackedProblems > 0 ? trackedProblems : 2498} curated catalog`,
      icon: Flame,
      color: "#E58A7A",
      progress:
        trackedProblems > 0
          ? (manuallySolved / trackedProblems) * 100
          : (manuallySolved / 2498) * 100,
    },
    {
      id: 4,
      title: "Daily Goal",
      value: `${todaySolved} / ${dailyGoal}`,
      subtitle:
        todaySolved >= dailyGoal
          ? "Goal completed today! 🎉"
          : `${Math.max(0, dailyGoal - todaySolved)} problems left today`,
      icon: Target,
      color: "#8BBF91",
      progress: dailyGoal > 0 ? (todaySolved / dailyGoal) * 100 : 0,
      badge:
        todaySolved >= dailyGoal
          ? "Done"
          : `${Math.round((todaySolved / Math.max(1, dailyGoal)) * 100)}%`,
    },
  ];

  const easyCount = liveDashboard?.difficulty?.easy ?? 0;
  const mediumCount = liveDashboard?.difficulty?.medium ?? 0;
  const hardCount = liveDashboard?.difficulty?.hard ?? 0;

  // Realistic DSA Benchmark targets (LeetCode catalog standards)
  const easyTarget = Math.max(850, Math.ceil((easyCount + 10) / 100) * 100);
  const mediumTarget = Math.max(1750, Math.ceil((mediumCount + 10) / 100) * 100);
  const hardTarget = Math.max(750, Math.ceil((hardCount + 10) / 100) * 100);
  const totalDifficultySolved = easyCount + mediumCount + hardCount;
  const totalDifficultyTarget = easyTarget + mediumTarget + hardTarget;
  const overallPercentage =
    totalDifficultyTarget > 0
      ? ((totalDifficultySolved / totalDifficultyTarget) * 100).toFixed(1)
      : "0.0";

  // Display platforms with complete live details
  const displayPlatforms = livePlatforms.map((p, idx) => {
    const statsObj = liveDashboard?.platforms?.find(
      (s) => s.platform === p.platform,
    );
    return {
      id: p._id || idx,
      platformId: p._id,
      platform: p.platform,
      name: platformDisplayNames[p.platform] || p.platform,
      username: p.username,
      solved: statsObj?.totalSolved || 0,
      easySolved: statsObj?.easySolved || 0,
      mediumSolved: statsObj?.mediumSolved || 0,
      hardSolved: statsObj?.hardSolved || 0,
      rating: statsObj?.rating || null,
      maxRating: statsObj?.maxRating || null,
      globalRank: statsObj?.globalRank || null,
      countryRank: statsObj?.countryRank || null,
      contestsParticipated: statsObj?.contestsParticipated || 0,
      stars: statsObj?.stars || 0,
      streak: statsObj?.streak || 0,
      badges: statsObj?.badges || [],
      certifications: statsObj?.certifications || 0,
      details: statsObj?.details || {},
      syncStatus: p.syncStatus,
      syncError: p.syncError,
      color: platformColors[p.platform] || "#7C5CFC",
      profileUrl: p.profileUrl,
      onDelete: handleDeletePlatform,
      isSyncing: syncingPlatform === p.platform,
      onSync: () => handleSyncPlatform(p.platform),
    };
  });

  // Accurate 7-day current week timeline (Mon to Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);
  monday.setHours(0, 0, 0, 0);

  const weekActivityMap = new Map();
  if (Array.isArray(liveDashboard?.activity)) {
    for (const a of liveDashboard.activity) {
      if (a.date) {
        weekActivityMap.set(a.date, a.problemsSolved || 0);
      }
    }
  }

  const activityData = daysOfWeek.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split("T")[0];
    return {
      day: dayName,
      solved: weekActivityMap.get(dateStr) || 0,
    };
  });

  return (
    <div className="page">
      <Header
        title={
          isAuthenticated && user?.name
            ? `Welcome back, ${user.name}`
            : "Dashboard"
        }
        subtitle="Track your coding journey and real-time DSA progress."
      />

      {!isAuthenticated && (
        <div className="guest-banner">
          <div className="guest-banner-content">
            <div className="guest-banner-text">
              <h4>Connect your live account</h4>
              <p>
                Sign in to link your LeetCode and Codeforces accounts, track
                real-time progress, and save problems to MongoDB.
              </p>
            </div>
            <Link to="/login" className="button button-primary">
              <LogIn size={16} /> Sign In
            </Link>
          </div>
        </div>
      )}

      {syncMessage && (
        <div className="sync-banner success">
          <CheckCircle2 size={18} />
          <span>{syncMessage}</span>
        </div>
      )}

      <section className="stats-grid">
        {currentStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            badge={stat.badge}
            progress={stat.progress}
            className={stat.className}
          />
        ))}
      </section>

      <section className="dashboard-grid">
        <ActivityChart data={activityData} />

        <div className="panel">
          <div className="panel-heading">
            <div className="dsa-progress-header">
              <div>
                <h3>DSA Progress Tracker</h3>
                <p>
                  {totalDifficultySolved.toLocaleString()} of{" "}
                  {totalDifficultyTarget.toLocaleString()} catalog problems solved ({overallPercentage}%)
                </p>
              </div>
              <div className="dsa-total-badge">
                <span className="badge-highlight">{totalDifficultySolved}</span>
                <span className="badge-sub">Solved</span>
              </div>
            </div>
          </div>

          <div className="progress-list">
            <ProgressBar
              label="Easy Problems"
              value={easyCount}
              max={easyTarget}
              color="#8BBF91"
            />
            <ProgressBar
              label="Medium Problems"
              value={mediumCount}
              max={mediumTarget}
              color="#E3B56C"
            />
            <ProgressBar
              label="Hard Problems"
              value={hardCount}
              max={hardTarget}
              color="#E58A7A"
            />
          </div>

          <div className="dsa-sheet-tracker-footer">
            <div className="dsa-sheet-info">
              <span className="sheet-tracker-label">
                Curated DSA Sheets Practice
              </span>
              <strong className="sheet-tracker-count">
                {manuallySolved} / {trackedProblems > 0 ? trackedProblems : 2498}{" "}
                completed
              </strong>
            </div>
            <Link
              to="/sheets"
              className="button button-secondary sheet-practice-btn"
            >
              Practice Sheets →
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Connected Platforms</h3>
            <p>Your coding profiles at a glance</p>
          </div>
          {isAuthenticated && (
            <div className="panel-heading-actions">
              <Button
                variant="secondary"
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw
                  size={15}
                  className={syncing ? "animate-spin" : ""}
                />
                {syncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button onClick={() => setShowLinkModal(true)}>
                <Plus size={15} /> Link Platform
              </Button>
            </div>
          )}
        </div>

        {displayPlatforms.length > 0 ? (
          <div className="platform-grid">
            {displayPlatforms.map((platform) => (
              <PlatformCard key={platform.id} {...platform} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No platforms connected yet"
            description="Connect your LeetCode or Codeforces account to track live ratings and problems solved."
            action={
              isAuthenticated ? (
                <Button onClick={() => setShowLinkModal(true)}>
                  <Plus size={15} /> Link Platform
                </Button>
              ) : (
                <Link to="/login" className="button button-primary">
                  <LogIn size={15} /> Sign In to Link
                </Link>
              )
            }
          />
        )}
      </section>

      {/* Link Platform Modal */}
      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Link Coding Profile</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowLinkModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {linkError && (
              <div className="auth-alert error">
                <span>{linkError}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleLinkPlatform}>
              <div className="form-group">
                <label>Select Platform</label>
                <select
                  value={linkData.platform}
                  onChange={(e) =>
                    setLinkData({ ...linkData, platform: e.target.value })
                  }
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="codechef">CodeChef</option>
                  <option value="gfg">GeeksforGeeks</option>
                  <option value="github">GitHub</option>
                </select>
              </div>

              <div className="form-group">
                <label>Platform Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. tourist, neal, etc."
                  value={linkData.username}
                  onChange={(e) =>
                    setLinkData({ ...linkData, username: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowLinkModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={linkLoading}>
                  {linkLoading ? "Linking..." : "Connect Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
