import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProblemTable from "../components/ProblemTable";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { Plus, Search, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { problemApi } from "../services/api";

const defaultProblemForm = {
  title: "",
  platform: "leetcode",
  topic: "Array",
  difficulty: "Easy",
  status: "Todo",
  problemUrl: "",
};

const Problems = () => {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");

  const [problems, setProblems] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(defaultProblemForm);
  const [submitting, setSubmitting] = useState(false);

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!isAuthenticated) {
        setProblems([]);
        return;
      }

      try {
        const params = { limit: 2500 };
        if (difficulty !== "All") params.difficulty = difficulty;
        if (status !== "All") params.status = status.toLowerCase();

        const res = await problemApi.getProblems(params);
        if (active && res?.success && Array.isArray(res.data)) {
          setProblems(res.data);
        }
      } catch (err) {
        console.warn("Failed to load problems from API:", err.message);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, difficulty, status]);

  const filteredProblems = problems.filter((problem) => {
    const topicText = Array.isArray(problem.topics)
      ? problem.topics.join(" ")
      : problem.topic || "";

    const matchesSearch =
      problem.title?.toLowerCase().includes(search.toLowerCase()) ||
      topicText.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;

    const normalizedProbStatus = (problem.status || "").toLowerCase();
    const matchesStatus =
      status === "All" ||
      normalizedProbStatus === status.toLowerCase() ||
      (status === "Attempted" && normalizedProbStatus === "revision");

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    // Update local state immediately for responsive UI
    setProblems((prev) =>
      prev.map((p) =>
        p._id === id || p.id === id ? { ...p, status: newStatus } : p,
      ),
    );

    if (isAuthenticated) {
      try {
        await problemApi.updateProblem(id, { status: newStatus.toLowerCase() });
        showNotification(`Problem status updated to ${newStatus}`);
      } catch (err) {
        showNotification(
          err.response?.data?.message || "Failed to update status",
          "error",
        );
      }
    }
  };

  const handleDeleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    setProblems((prev) => prev.filter((p) => (p._id || p.id) !== id));

    if (isAuthenticated) {
      try {
        await problemApi.deleteProblem(id);
        showNotification("Problem deleted successfully");
      } catch {
        showNotification("Failed to delete problem from server", "error");
      }
    }
  };

  const handleAddProblemSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      platform: formData.platform.toLowerCase(),
      topics: [formData.topic.trim()],
      difficulty: formData.difficulty,
      status: formData.status.toLowerCase(),
      problemUrl: formData.problemUrl.trim(),
    };

    if (isAuthenticated) {
      try {
        const res = await problemApi.createProblem(payload);
        if (res?.success && res.data) {
          setProblems((prev) => [res.data, ...prev]);
          showNotification("Problem saved to database!");
          setShowAddModal(false);
          setFormData(defaultProblemForm);
        }
      } catch (err) {
        showNotification(
          err.response?.data?.message || "Failed to add problem",
          "error",
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local session mode
      const localProblem = {
        id: Date.now(),
        ...payload,
        topic: formData.topic,
      };
      setProblems((prev) => [localProblem, ...prev]);
      showNotification("Problem added to current session");
      setShowAddModal(false);
      setFormData(defaultProblemForm);
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Header
        title="Problems"
        subtitle="Manage and track your DSA practice questions."
      />

      {message.text && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            background:
              message.type === "error"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(34, 197, 94, 0.15)",
            border: `1px solid ${message.type === "error" ? "#EF4444" : "#22C55E"}`,
            borderRadius: 10,
            color: message.type === "error" ? "#FCA5A5" : "#4ADE80",
            marginBottom: 20,
          }}
        >
          {message.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <section className="panel sheet-toolbar-panel">
        <div className="sheet-toolbar">
          <div className="sheet-search-box">
            <Search size={18} className="sheet-search-icon" />
            <input
              type="text"
              placeholder="Search problems or topics..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sheet-search-input"
            />
            {search && (
              <button
                type="button"
                className="sheet-search-clear"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="sheet-select-wrapper">
            <select
              className="sheet-filter-select"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="sheet-select-wrapper">
            <select
              className="sheet-filter-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="Attempted">Attempted</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div className="sheet-toolbar-actions">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Problem
            </Button>
          </div>
        </div>

        {filteredProblems.length > 0 ? (
          <ProblemTable
            problems={filteredProblems}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteProblem}
          />
        ) : (
          <EmptyState
            title="No problems tracked yet"
            description="Add your first problem with the 'Add Problem' button or track questions directly from DSA Sheets."
            action={
              <Button onClick={() => setShowAddModal(true)}>
                <Plus size={17} /> Add Problem
              </Button>
            }
          />
        )}
      </section>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add DSA Problem</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAddProblemSubmit}>
              <div className="form-group">
                <label>Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trapping Rain Water"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label>Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                  >
                    <option value="leetcode">LeetCode</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="codechef">CodeChef</option>
                    <option value="gfg">GeeksforGeeks</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label>Topic / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Dynamic Programming, Trees"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Todo">Todo</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Solved">Solved</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Problem URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={formData.problemUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, problemUrl: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Add Problem"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problems;
