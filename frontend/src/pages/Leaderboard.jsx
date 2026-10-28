import { useState, useEffect } from "react";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import { Trophy, Medal } from "lucide-react";
import { leaderboardApi } from "../services/api";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchLeaderboard = async () => {
      try {
        const res = await leaderboardApi.getLeaderboard();
        if (
          active &&
          res?.success &&
          Array.isArray(res.data?.entries) &&
          res.data.entries.length > 0
        ) {
          const mapped = res.data.entries.map((entry) => ({
            rank: entry.rank,
            name: entry.user?.name || entry.user?.username || "Anonymous",
            solved: entry.totalSolved || 0,
            rating: entry.rating || 0,
          }));
          setUsers(mapped);
        } else if (active) {
          setUsers([]);
        }
      } catch (err) {
        console.warn("Live leaderboard fetch error:", err.message);
        if (active) setUsers([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <Header
        title="Leaderboard"
        subtitle="Compare coding progress with other developers."
      />

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>
              <Trophy size={20} /> Top Coders
            </h3>
            <p>Live rankings from registered developers</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading rankings...</p>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title="No competitors on leaderboard yet"
            description="Be the first to register an account, link your coding platforms, and climb the leaderboard!"
          />
        ) : (
          <div className="table-container">
            <table className="problem-table leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>Rank</th>
                  <th>Developer</th>
                  <th style={{ width: 180 }}>Problems Solved</th>
                  <th style={{ width: 140 }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.rank} className={user.rank <= 3 ? `top-rank-${user.rank}` : ""}>
                    <td className="rank-cell">
                      {user.rank === 1 ? (
                        <span className="rank-badge gold" title="1st Place">
                          <Medal size={17} /> 1
                        </span>
                      ) : user.rank === 2 ? (
                        <span className="rank-badge silver" title="2nd Place">
                          <Medal size={17} /> 2
                        </span>
                      ) : user.rank === 3 ? (
                        <span className="rank-badge bronze" title="3rd Place">
                          <Medal size={17} /> 3
                        </span>
                      ) : (
                        <span className="rank-number">#{user.rank}</span>
                      )}
                    </td>
                    <td className="developer-name-cell">{user.name}</td>
                    <td className="solved-cell">
                      <strong>{user.solved}</strong>
                    </td>
                    <td className="rating-cell">{user.rating || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="page-note">
        Rankings dynamically update when developers register and sync their platforms.
      </p>
    </div>
  );
};

export default Leaderboard;
