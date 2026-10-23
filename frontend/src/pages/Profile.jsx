import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { Code2, Trophy, Flame, ExternalLink } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashboardApi, platformApi } from "../services/api";

const platformNames = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  gfg: "GeeksforGeeks",
  github: "GitHub",
};

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;

    Promise.all([
      dashboardApi.getDashboard().catch(() => null),
      platformApi.getPlatforms().catch(() => null),
    ]).then(([dashRes, platRes]) => {
      if (active) {
        if (dashRes?.success) setDashboard(dashRes.data);
        if (platRes?.success) setPlatforms(platRes.data || []);
      }
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const displayName = user?.name || "CodeTrack Developer";
  const username = user?.username ? `@${user.username}` : "@developer";
  const bio = user?.bio || "Building consistency, one problem at a time.";
  const avatarLetter = (displayName || "C").charAt(0).toUpperCase();

  const githubProfile = platforms.find((p) => p.platform === "github");
  const githubUsername = user?.github || githubProfile?.username;
  const githubUrl = githubUsername
    ? `https://github.com/${githubUsername}`
    : "https://github.com";

  const totalSolved = dashboard?.summary?.totalSolved ?? 0;
  const peakRating =
    dashboard?.platforms?.length > 0
      ? Math.max(
        0,
        ...dashboard.platforms.map((s) =>
          Math.max(Number(s.rating || 0), Number(s.maxRating || 0)),
        ),
      )
      : 0;

  return (
    <div className="page">
      <Header
        title="My Profile"
        subtitle="Your developer profile and coding achievements."
      />

      <section className="panel profile-card">
        <div className="profile-avatar">{avatarLetter}</div>

        <div className="profile-details">
          <h2>{displayName}</h2>
          <p style={{ color: "#818CF8", fontWeight: 600 }}>{username}</p>
          <p>{bio}</p>
        </div>

        <a
          className="button button-secondary"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub Profile
        </a>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Problems Solved"
          value={totalSolved}
          subtitle="Across practice sessions & platforms"
          icon={Code2}
          color="#7C5CFC"
        />

        <StatCard
          title="Contest Rating"
          value={peakRating > 0 ? peakRating : "—"}
          subtitle="Peak rating"
          icon={Trophy}
          color="#F59E0B"
        />

        <StatCard
          title="Current Streak"
          value={`${dashboard?.activity?.length ? Math.min(dashboard.activity.length, 7) : 0} Days`}
          subtitle="Consistency count"
          icon={Flame}
          color="#EF4444"
        />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Connected Accounts</h3>
            <p>Links to your real-time coding profiles</p>
          </div>
        </div>

        <div className="account-list">
          {!githubProfile && (
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub <span>View profile ↗</span>
            </a>
          )}

          {platforms.map((p) => {
            const stat = dashboard?.platforms?.find(
              (s) => s.platform === p.platform,
            );
            const label = platformNames[p.platform] || p.platform;
            let extra;
            if (p.platform === "github") {
              extra = stat
                ? `${stat.details?.public_repos ?? stat.totalSolved} repos • ${stat.details?.totalStars ?? stat.stars ?? 0} stars`
                : `@${p.username}`;
            } else {
              extra = stat
                ? `${stat.totalSolved} solved${stat.rating ? ` • Rating: ${stat.rating}` : ""}`
                : `@${p.username}`;
            }

            return (
              <a
                key={p._id || p.platform}
                href={p.profileUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>{label}</strong>
                  <span
                    style={{
                      marginLeft: 10,
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    ({extra})
                  </span>
                </div>
                <span>
                  View profile{" "}
                  <ExternalLink
                    size={13}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />
                </span>
              </a>
            );
          })}

          {platforms.length === 0 && (
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "8px 0" }}>
              No external platforms connected yet. Head to the Dashboard to link
              LeetCode, Codeforces, CodeChef, GeeksforGeeks, or
              GitHub.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
