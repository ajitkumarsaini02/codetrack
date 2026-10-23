import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { sheetApi } from "../services/api";
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Check,
  AlertCircle,
  Database,
  ChevronsDown,
  ChevronsUp,
  X,
} from "lucide-react";

const fallbackSheets = [
  {
    id: "leetcode",
    name: "LeetCode DSA Mastery Sheet",
    tagline: "1,498 Curated Problems • 22 Phases • 116 Topics",
    platform: "leetcode",
    iconColor: "#FFA116",
    description:
      "Comprehensive DSA roadmap covering all 116 sequential topics, with 10 questions per topic baseline and all unique problems.",
    totalProblems: 1498,
    phaseCount: 22,
    solvedCount: 0,
    progressPercentage: 0,
  },
  {
    id: "codeforces",
    name: "Codeforces DSA Mastery Sheet",
    tagline: "500 Curated Problems • Strict Sequential Order",
    platform: "codeforces",
    iconColor: "#22C55E",
    description:
      "Topic-wise Codeforces problems with difficulty ratings (★ 800–2600).",
    totalProblems: 500,
    phaseCount: 22,
    solvedCount: 0,
    progressPercentage: 0,
  },
  {
    id: "gfg",
    name: "GeeksforGeeks DSA Mastery Sheet",
    tagline: "500 Interview-Ready Problems • 22 Phases",
    platform: "gfg",
    iconColor: "#2F8D46",
    description:
      "Targeted practice sheet designed specifically for technical coding rounds.",
    totalProblems: 500,
    phaseCount: 22,
    solvedCount: 0,
    progressPercentage: 0,
  },
];

const Sheets = () => {
  const { isAuthenticated } = useAuth();
  const [sheetsList, setSheetsList] = useState(fallbackSheets);
  const [selectedSheetId, setSelectedSheetId] = useState("leetcode");
  const [currentSheet, setCurrentSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPhases, setExpandedPhases] = useState({ 1: true, 2: true });
  const [toastMessage, setToastMessage] = useState({ text: "", type: "" });

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: "", type: "" }), 3500);
  };

  // Load available sheets list
  useEffect(() => {
    let active = true;

    const fetchList = async () => {
      try {
        const res = await sheetApi.getSheets();
        if (active && res?.success && Array.isArray(res.data)) {
          setSheetsList(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch sheets list:", err.message);
      }
    };

    fetchList();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Load specific sheet content when selectedSheetId changes
  useEffect(() => {
    let active = true;

    const loadSheet = async () => {
      setLoading(true);
      try {
        const res = await sheetApi.getSheetById(selectedSheetId);
        if (active && res?.success && res.data) {
          setCurrentSheet(res.data);
          // Default expand first two phases
          if (res.data.phases?.[0]) {
            setExpandedPhases({
              [res.data.phases[0].phaseId]: true,
              [res.data.phases[1]?.phaseId || 2]: true,
            });
          }
        }
      } catch (err) {
        console.warn("Could not load sheet details:", err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSheet();

    return () => {
      active = false;
    };
  }, [selectedSheetId, isAuthenticated]);

  const togglePhase = (phaseId) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const expandAllPhases = () => {
    if (!currentSheet?.phases) return;
    const all = {};
    currentSheet.phases.forEach((p) => {
      all[p.phaseId] = true;
    });
    setExpandedPhases(all);
  };

  const collapseAllPhases = () => {
    setExpandedPhases({});
  };

  const [importing, setImporting] = useState(false);

  const handleImportAll = async () => {
    if (!isAuthenticated) {
      showToast(
        "Please sign in to sync questions to your MongoDB account",
        "error",
      );
      return;
    }
    setImporting(true);
    try {
      const res = await sheetApi.importAll();
      showToast(
        res.message || "All questions successfully synced to your database!",
      );
      const updated = await sheetApi.getSheetById(selectedSheetId);
      if (updated?.data) setCurrentSheet(updated.data);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to sync questions",
        "error",
      );
    } finally {
      setImporting(false);
    }
  };

  const handleToggleSolved = async (problem, topicName) => {
    const nextStatus = problem.status === "solved" ? "todo" : "solved";

    // Optimistically update current sheet state
    setCurrentSheet((prev) => {
      if (!prev) return prev;
      const updatedPhases = prev.phases.map((phase) => {
        let phaseSolvedDelta = 0;
        const updatedTopics = phase.topics.map((topic) => {
          let topicSolvedDelta = 0;
          const updatedProblems = topic.problems.map((p) => {
            if (p.id === problem.id || p.title === problem.title) {
              const wasSolved = p.status === "solved";
              const nowSolved = nextStatus === "solved";
              if (!wasSolved && nowSolved) {
                topicSolvedDelta += 1;
                phaseSolvedDelta += 1;
              } else if (wasSolved && !nowSolved) {
                topicSolvedDelta -= 1;
                phaseSolvedDelta -= 1;
              }
              return { ...p, status: nextStatus, isSolved: nowSolved };
            }
            return p;
          });

          const newSolvedCount = Math.max(
            0,
            (topic.solvedCount || 0) + topicSolvedDelta,
          );
          return {
            ...topic,
            problems: updatedProblems,
            solvedCount: newSolvedCount,
            percentage:
              topic.totalCount > 0
                ? Math.round((newSolvedCount / topic.totalCount) * 100)
                : 0,
          };
        });

        const newPhaseSolved = Math.max(
          0,
          (phase.solvedCount || 0) + phaseSolvedDelta,
        );
        return {
          ...phase,
          topics: updatedTopics,
          solvedCount: newPhaseSolved,
          percentage:
            phase.totalCount > 0
              ? Math.round((newPhaseSolved / phase.totalCount) * 100)
              : 0,
        };
      });

      const totalSolvedNow = updatedPhases.reduce(
        (acc, p) => acc + (p.solvedCount || 0),
        0,
      );
      return {
        ...prev,
        phases: updatedPhases,
        solvedProblems: totalSolvedNow,
        percentage:
          prev.totalProblems > 0
            ? Math.round((totalSolvedNow / prev.totalProblems) * 100)
            : 0,
      };
    });

    if (isAuthenticated) {
      try {
        await sheetApi.trackProblem({
          title: problem.title,
          platform: currentSheet?.platform || "leetcode",
          difficulty: problem.difficulty || "Easy",
          topic: topicName || "General",
          problemUrl: problem.url || "",
          status: nextStatus,
        });
        showToast(
          nextStatus === "solved"
            ? `Marked "${problem.title}" as Solved!`
            : `Marked "${problem.title}" as Todo`,
        );
      } catch (err) {
        showToast(
          err.response?.data?.message || "Failed to update status",
          "error",
        );
      }
    } else {
      showToast(
        nextStatus === "solved"
          ? `Marked "${problem.title}" as Solved (Sign in to sync with cloud)`
          : `Marked "${problem.title}" as Todo`,
      );
    }
  };

  // Filter problems within topics
  const filterProblem = (problem) => {
    const matchesSearch =
      !search ||
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      String(problem.id).toLowerCase().includes(search.toLowerCase());

    const matchesDiff =
      difficultyFilter === "All" ||
      problem.difficulty === difficultyFilter ||
      (difficultyFilter === "Easy" &&
        problem.rating != null &&
        problem.rating < 1200) ||
      (difficultyFilter === "Medium" &&
        problem.rating != null &&
        problem.rating >= 1200 &&
        problem.rating < 1800) ||
      (difficultyFilter === "Hard" &&
        problem.rating != null &&
        problem.rating >= 1800) ||
      (difficultyFilter === "Rating" && problem.rating != null);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Solved" && problem.status === "solved") ||
      (statusFilter === "Unsolved" && problem.status !== "solved");

    return matchesSearch && matchesDiff && matchesStatus;
  };

  return (
    <div className="page">
      <Header
        title="DSA Mastery Sheets"
        subtitle="Topic-wise curated roadmaps with progress tracking across LeetCode, Codeforces & GFG."
      />

      {toastMessage.text && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 18px",
            background:
              toastMessage.type === "error"
                ? "rgba(239, 68, 68, 0.18)"
                : "rgba(34, 197, 94, 0.18)",
            border: `1px solid ${toastMessage.type === "error" ? "#EF4444" : "#22C55E"}`,
            borderRadius: 12,
            color: toastMessage.type === "error" ? "#FCA5A5" : "#4ADE80",
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sheet Selection Cards */}
      <section className="sheets-selector-grid">
        {sheetsList.map((s) => {
          const isSelected = s.id === selectedSheetId;
          return (
            <div
              key={s.id}
              className={`sheet-card ${isSelected ? "active" : ""}`}
              onClick={() => setSelectedSheetId(s.id)}
              style={{
                borderColor: isSelected ? s.iconColor || "#7C5CFC" : undefined,
                boxShadow: isSelected
                  ? `0 0 20px ${s.iconColor || "#7C5CFC"}30`
                  : undefined,
              }}
            >
              <div className="sheet-card-top">
                <span
                  className="sheet-platform-pill"
                  style={{
                    backgroundColor: `${s.iconColor}20`,
                    color: s.iconColor,
                    borderColor: `${s.iconColor}40`,
                  }}
                >
                  {s.platform.toUpperCase()}
                </span>
                <span className="sheet-phase-badge">{s.phaseCount} Phases</span>
              </div>

              <h3>{s.name}</h3>
              <p className="sheet-tagline">{s.tagline}</p>

              <div className="sheet-card-footer">
                <div className="sheet-meta">
                  <strong>{s.totalProblems}</strong>
                  <span>Problems</span>
                </div>

                <div className="sheet-meta">
                  <strong
                    style={{ color: s.solvedCount > 0 ? "#4ADE80" : undefined }}
                  >
                    {s.solvedCount || 0}
                  </strong>
                  <span>Solved</span>
                </div>

                <div className="sheet-progress-ring">
                  <span>{s.progressPercentage || 0}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Overview Banner for Current Sheet */}
      {currentSheet && (
        <section className="panel sheet-overview-panel">
          <div className="sheet-overview-header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2>{currentSheet.name}</h2>
                <span className="platform-tag">{currentSheet.platform}</span>
              </div>
              <p className="sheet-overview-desc">
                {currentSheet.description}
              </p>
            </div>

            <div className="sheet-overall-stats">
              <div className="overall-stat-item">
                <Trophy size={20} style={{ color: currentSheet.iconColor }} />
                <div>
                  <strong>
                    {currentSheet.solvedProblems || 0} /{" "}
                    {currentSheet.totalProblems || 0}
                  </strong>
                  <span>Solved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sheet-progress-bar-container">
            <div className="sheet-progress-info">
              <span>Roadmap Completion</span>
              <strong>{currentSheet.percentage || 0}%</strong>
            </div>
            <div className="progress-track" style={{ height: 10 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${currentSheet.percentage || 0}%`,
                  background: `linear-gradient(90deg, ${currentSheet.iconColor || "#7C5CFC"}, #3B82F6)`,
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters Toolbar */}
      <section className="panel sheet-toolbar-panel">
        <div className="sheet-toolbar">
          <div className="sheet-search-box">
            <Search size={18} className="sheet-search-icon" />
            <input
              type="text"
              placeholder="Search problems, topics or question ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Filter by difficulty"
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          <div className="sheet-toolbar-actions">
            <button
              type="button"
              className="sheet-action-btn"
              onClick={expandAllPhases}
              title="Expand all phases"
            >
              <ChevronsDown size={15} />
              <span>Expand All</span>
            </button>
            <button
              type="button"
              className="sheet-action-btn"
              onClick={collapseAllPhases}
              title="Collapse all phases"
            >
              <ChevronsUp size={15} />
              <span>Collapse All</span>
            </button>
            <button
              type="button"
              className="sheet-sync-btn"
              onClick={handleImportAll}
              disabled={importing}
              title="Add all questions from all sheets to your personal database"
            >
              <Database size={15} />
              <span>{importing ? "Importing..." : "Sync All to DB"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sheet Content: Phases -> Topics -> Questions */}
      {loading ? (
        <div
          className="panel"
          style={{ textAlign: "center", padding: 48, color: "#9CA3AF" }}
        >
          <Sparkles
            size={28}
            className="animate-spin"
            style={{ margin: "0 auto 12px", color: "#818CF8" }}
          />
          <p>Loading curated sheet questions...</p>
        </div>
      ) : (
        <div className="sheet-phases-container">
          {currentSheet?.phases?.map((phase) => {
            const isExpanded = Boolean(expandedPhases[phase.phaseId]);
            const totalProblemsInPhase = phase.totalCount || 0;
            const solvedInPhase = phase.solvedCount || 0;
            const phasePct = phase.percentage || 0;

            return (
              <div key={phase.phaseId} className="phase-card">
                <div
                  className="phase-header"
                  onClick={() => togglePhase(phase.phaseId)}
                >
                  <div className="phase-title-group">
                    <span className="phase-badge">Phase {phase.phaseId}</span>
                    <h3>{phase.phaseName}</h3>
                  </div>

                  <div className="phase-header-actions">
                    <span className="phase-progress-pill">
                      {solvedInPhase} / {totalProblemsInPhase} Solved (
                      {phasePct}%)
                    </span>
                    <button
                      className="phase-chevron-btn"
                      aria-label="Toggle Phase"
                    >
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="phase-body">
                    {phase.topics.map((topic) => {
                      const visibleProblems =
                        topic.problems.filter(filterProblem);
                      if (
                        visibleProblems.length === 0 &&
                        (search ||
                          difficultyFilter !== "All" ||
                          statusFilter !== "All")
                      ) {
                        return null;
                      }

                      return (
                        <div key={topic.topicId} className="sheet-topic-block">
                          <div className="topic-header">
                            <div>
                              <h4>
                                {topic.topicId}. {topic.topicName}
                              </h4>
                              <span className="topic-count-tag">
                                {topic.solvedCount || 0} /{" "}
                                {topic.totalCount || topic.problems.length}{" "}
                                Completed
                              </span>
                            </div>

                            <div className="topic-mini-track">
                              <div
                                className="topic-mini-fill"
                                style={{ width: `${topic.percentage || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="sheet-problems-list">
                            {visibleProblems.map((problem) => {
                              const isSolved = problem.status === "solved";
                              const diffClass = (
                                problem.difficulty || "Easy"
                              ).toLowerCase();

                              return (
                                <div
                                  key={problem.title}
                                  className={`sheet-problem-row ${isSolved ? "solved-row" : ""}`}
                                >
                                  <button
                                    type="button"
                                    className={`sheet-check-btn ${isSolved ? "checked" : ""}`}
                                    onClick={() =>
                                      handleToggleSolved(
                                        problem,
                                        topic.topicName,
                                      )
                                    }
                                    title={
                                      isSolved
                                        ? "Mark as Unsolved"
                                        : "Mark as Solved"
                                    }
                                  >
                                    {isSolved ? (
                                      <Check size={16} strokeWidth={3} />
                                    ) : (
                                      <Circle size={16} />
                                    )}
                                  </button>

                                  <div className="sheet-problem-title-cell">
                                    <span className="sheet-problem-id">
                                      {String(problem.id).startsWith("#") ||
                                      String(problem.id).startsWith("CF") ||
                                      String(problem.id).startsWith("gfg")
                                        ? problem.id
                                        : `#${problem.id}`}
                                    </span>
                                    <a
                                      href={problem.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="sheet-problem-link"
                                    >
                                      <span>{problem.title}</span>
                                      <ExternalLink
                                        size={12}
                                        className="ext-icon"
                                      />
                                    </a>
                                  </div>

                                  <div className="sheet-problem-badges">
                                    {problem.rating ? (
                                      <span className="codeforces-rating-badge">
                                        ★ {problem.rating}
                                      </span>
                                    ) : null}

                                    <span
                                      className={`difficulty-badge ${diffClass}`}
                                    >
                                      {problem.difficulty}
                                    </span>

                                    <span
                                      className={`sheet-status-pill ${isSolved ? "solved" : "todo"}`}
                                    >
                                      {isSolved ? "Solved" : "Todo"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sheets;
