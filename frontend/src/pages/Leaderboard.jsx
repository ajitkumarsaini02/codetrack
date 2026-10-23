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
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
            Loading rankings...
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title="No competitors on leaderboard yet"
            description="Be the first to register an account, link your coding platforms, and climb the leaderboard!"
          />
        ) : (
          <div className="table-container">
            <table className="problem-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Developer</th>
                  <th>Problems Solved</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.rank}>
                    <td>
                      {user.rank <= 3 ? (
                        <Medal
                          size={18}
                          style={{
                            color:
                              user.rank === 1
                                ? "#F59E0B"
                                : user.rank === 2
                                  ? "#94A3B8"
                                  : "#B45309",
                          }}
                        />
                      ) : (
                        `#${user.rank}`
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td>{user.solved}</td>
                    <td>{user.rating || "-"}</td>
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
