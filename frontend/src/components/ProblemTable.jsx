import { ExternalLink, Trash2 } from "lucide-react";

const platformLabels = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  gfg: "GeeksforGeeks",
  github: "GitHub",
};

const ProblemTable = ({ problems = [], onStatusChange, onDelete }) => {
  return (
    <div className="table-container">
      <table className="problem-table">
        <thead>
          <tr>
            <th style={{ minWidth: 260 }}>Problem</th>
            <th style={{ width: 130 }}>Platform</th>
            <th style={{ width: 220 }}>Topic</th>
            <th style={{ width: 110 }}>Difficulty</th>
            <th style={{ width: 130 }}>Status</th>
            {onDelete && (
              <th style={{ width: 60, textAlign: "center" }}>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {problems.map((problem) => {
            const problemId = problem._id || problem.id;
            const topicDisplay = Array.isArray(problem.topics)
              ? problem.topics.join(", ") || "General"
              : problem.topic || "General";
            const problemUrl = problem.problemUrl || problem.url;

            // Capitalize status for display
            const normalizedStatus = problem.status
              ? problem.status.charAt(0).toUpperCase() +
                problem.status.slice(1).toLowerCase()
              : "Todo";

            const difficultyClass = problem.difficulty
              ? problem.difficulty.toLowerCase()
              : "easy";

            const platformKey = (problem.platform || "other").toLowerCase();
            const platformName = platformLabels[platformKey] || problem.platform;

            return (
              <tr key={problemId}>
                <td className="problem-title">
                  {problemUrl ? (
                    <a
                      href={problemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="problem-link"
                    >
                      <span>{problem.title}</span>
                      <ExternalLink size={13} className="ext-icon" />
                    </a>
                  ) : (
                    <span>{problem.title}</span>
                  )}
                </td>

                <td>
                  <span className={`table-platform-pill ${platformKey}`}>
                    {platformName}
                  </span>
                </td>

                <td className="problem-topic-text">{topicDisplay}</td>

                <td>
                  <span className={`difficulty-badge ${difficultyClass}`}>
                    {problem.difficulty}
                  </span>
                </td>

                <td>
                  <select
                    className="status-select"
                    value={normalizedStatus}
                    onChange={(event) =>
                      onStatusChange?.(problemId, event.target.value)
                    }
                    aria-label={`Status for ${problem.title}`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Solved">Solved</option>
                  </select>
                </td>

                {onDelete && (
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="table-delete-btn"
                      onClick={() => onDelete(problemId)}
                      title="Delete problem"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}

          {problems.length === 0 && (
            <tr>
              <td
                colSpan={onDelete ? 6 : 5}
                style={{ textAlign: "center", padding: "28px", color: "#94A3B8" }}
              >
                No problems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemTable;
