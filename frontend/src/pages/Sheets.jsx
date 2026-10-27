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
  ChevronsDown,
  ChevronsUp,
  X,
} from "lucide-react";

const fallbackSheets = [
  {
    id: "leetcode",
    name: "LeetCode DSA Mastery Sheet",
    tagline: "947 Curated Problems • 22 Phases • 115 Topics",
    platform: "leetcode",
    iconColor: "#FFA116",
    description:
      "Comprehensive DSA roadmap covering all 115 sequential topics, with 10 questions per topic baseline and all unique problems.",
    totalProblems: 947,
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
];

const GUEST_STORAGE_KEY = "codetrack_guest_solved_sheet";

const getGuestSolvedMap = () => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveGuestProblem = (platform, title, status) => {
  try {
    const map = getGuestSolvedMap();
    const key = `${(platform || "leetcode").toLowerCase()}:${title.toLowerCase().trim()}`;
    if (status === "solved") {
      map[key] = true;
    } else {
      delete map[key];
    }
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
  }
};

const Sheets = () => {
  const { isAuthenticated } = useAuth();
  const [sheetsList, setSheetsList] = useState(fallbackSheets);
  const [selectedSheetId, setSelectedSheetId] = useState("leetcode");
  const [currentSheet, setCurrentSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPhases, setExpandedPhases] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
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
          let sheetData = res.data;

          // Overlay guest progress if not logged in
          if (!isAuthenticated) {
            const guestMap = getGuestSolvedMap();
            const currentPlat = (
              sheetData.platform || selectedSheetId
            ).toLowerCase();
            let totalGuestSolved = 0;

            const updatedPhases = sheetData.phases.map((phase) => {
              let phaseSolved = 0;
              const updatedTopics = phase.topics.map((topic) => {
                let topicSolved = 0;
                const updatedProblems = topic.problems.map((p) => {
                  const key = `${currentPlat}:${p.title.toLowerCase().trim()}`;
                  const isSolved = Boolean(guestMap[key]);
                  if (isSolved) topicSolved++;
                  return {
                    ...p,
                    status: isSolved ? "solved" : "todo",
                    isSolved,
                  };
                });
                phaseSolved += topicSolved;
                return {
                  ...topic,
                  problems: updatedProblems,
                  solvedCount: topicSolved,
                  percentage:
                    topic.totalCount > 0
                      ? Math.round((topicSolved / topic.totalCount) * 100)
                      : 0,
                };
              });
              totalGuestSolved += phaseSolved;
              return {
                ...phase,
                topics: updatedTopics,
                solvedCount: phaseSolved,
                percentage:
                  phase.totalCount > 0
                    ? Math.round((phaseSolved / phase.totalCount) * 100)
                    : 0,
              };
            });

            sheetData = {
              ...sheetData,
              phases: updatedPhases,
              solvedProblems: totalGuestSolved,
              percentage:
                sheetData.totalProblems > 0
                  ? Math.round(
                      (totalGuestSolved / sheetData.totalProblems) * 100,
                    )
                  : 0,
            };

            setSheetsList((prev) =>
              prev.map((s) => {
                if (
                  s.id === selectedSheetId ||
                  s.platform === (sheetData.platform || selectedSheetId)
                ) {
                  return {
                    ...s,
                    solvedCount: totalGuestSolved,
                    progressPercentage:
                      sheetData.totalProblems > 0
                        ? Math.round(
                            (totalGuestSolved / sheetData.totalProblems) * 100,
                          )
                        : 0,
                  };
                }
                return s;
              }),
            );
          } else {
            // If logged in, sync any stored guest progress to cloud
            const guestMap = getGuestSolvedMap();
            const keys = Object.keys(guestMap);
            if (keys.length > 0) {
              Promise.all(
                keys.map((k) => {
                  const [plat, ...titleParts] = k.split(":");
                  return sheetApi.trackProblem({
                    title: titleParts.join(":"),
                    platform: plat,
                    status: "solved",
                  });
                }),
              )
                .then(() => {
                  localStorage.removeItem(GUEST_STORAGE_KEY);
                })
                .catch(() => null);
            }
          }

          setCurrentSheet(sheetData);

          // All phases and topics start collapsed by default
          setExpandedPhases({});
          setExpandedTopics({});
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

  const toggleTopic = (phaseId, topicId) => {
    const key = `${phaseId}_${topicId}`;
    setExpandedTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
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

    // Optimistically update summary card counts for the active sheet
    setSheetsList((prev) =>
      prev.map((s) => {
        if (
          s.id === selectedSheetId ||
          s.platform === (currentSheet?.platform || selectedSheetId)
        ) {
          const newSolved = Math.max(
            0,
            (s.solvedCount || 0) + (nextStatus === "solved" ? 1 : -1),
          );
          return {
            ...s,
            solvedCount: newSolved,
            progressPercentage:
              s.totalProblems > 0
                ? Math.round((newSolved / s.totalProblems) * 100)
                : 0,
          };
        }
        return s;
      }),
    );

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
          err.response?.data?.message || "Failed to update status in database",
          "error",
        );
      }
    } else {
      saveGuestProblem(
        currentSheet?.platform || selectedSheetId || "leetcode",
        problem.title,
        nextStatus,
      );

      showToast(
        nextStatus === "solved"
          ? `Marked "${problem.title}" as Solved (Saved locally. Sign in to sync across devices)`
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
        subtitle="Topic-wise curated roadmaps with progress tracking across LeetCode and Codeforces."
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

                      const topicKey = `${phase.phaseId}_${topic.topicId}`;
                      const hasFilter = Boolean(
                        search.trim() ||
                          difficultyFilter !== "All" ||
                          statusFilter !== "All",
                      );
                      const isTopicExpanded = hasFilter
                        ? expandedTopics[topicKey] !== false
                        : Boolean(expandedTopics[topicKey]);

                      const topicSolved = topic.solvedCount || 0;
                      const topicTotal =
                        topic.totalCount || topic.problems?.length || 0;
                      const topicPct =
                        topic.percentage != null
                          ? topic.percentage
                          : topicTotal > 0
                            ? Math.round((topicSolved / topicTotal) * 100)
                            : 0;

                      return (
                        <div
                          key={topic.topicId}
                          className={`sheet-topic-block ${isTopicExpanded ? "is-expanded" : "is-collapsed"}`}
                        >
                          <div
                            className="topic-header"
                            onClick={() =>
                              toggleTopic(phase.phaseId, topic.topicId)
                            }
                            role="button"
                            tabIndex={0}
                            aria-expanded={isTopicExpanded}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleTopic(phase.phaseId, topic.topicId);
                              }
                            }}
                          >
                            <div className="topic-title-group">
                              <h4>
                                {topic.topicId}. {topic.topicName}
                              </h4>
                            </div>

                            <div className="topic-header-actions">
                              <span className="topic-progress-pill">
                                {topicSolved} / {topicTotal} Completed
                              </span>

                              <div
                                className="topic-mini-track"
                                title={`${topicPct}% Completed`}
                              >
                                <div
                                  className="topic-mini-fill"
                                  style={{ width: `${topicPct}%` }}
                                />
                              </div>

                              <button
                                type="button"
                                className="topic-chevron-btn"
                                aria-label={
                                  isTopicExpanded
                                    ? "Collapse Topic"
                                    : "Expand Topic"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTopic(phase.phaseId, topic.topicId);
                                }}
                              >
                                {isTopicExpanded ? (
                                  <ChevronUp size={18} />
                                ) : (
                                  <ChevronDown size={18} />
                                )}
                              </button>
                            </div>
                          </div>

                          {isTopicExpanded && (
                            <div className="sheet-topic-body">
                              <div className="sheet-problems-list">
                                {visibleProblems.map((problem) => {
                                  const isSolved = problem.status === "solved";
                                  const diffClass = (
                                    problem.difficulty || "Easy"
                                  ).toLowerCase();

                                  // Detect if rating and difficulty are redundant (e.g. Codeforces where rating is 800 and difficulty is "★ 800")
                                  const ratingVal =
                                    problem.rating ||
                                    (typeof problem.difficulty === "string" &&
                                    problem.difficulty.startsWith("★")
                                      ? problem.difficulty.replace("★", "").trim()
                                      : null);

                                  const isRatingDuplicate =
                                    Boolean(ratingVal) &&
                                    typeof problem.difficulty === "string" &&
                                    (problem.difficulty.includes("★") ||
                                      problem.difficulty.trim() === String(ratingVal));

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
                                          String(problem.id).startsWith("CF")
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
                                        {ratingVal ? (
                                          <span className="codeforces-rating-badge">
                                            ★ {ratingVal}
                                          </span>
                                        ) : null}

                                        {problem.difficulty && !isRatingDuplicate ? (
                                          <span
                                            className={`difficulty-badge ${diffClass}`}
                                          >
                                            {problem.difficulty}
                                          </span>
                                        ) : null}

                                        <button
                                          type="button"
                                          className={`sheet-status-pill ${isSolved ? "solved" : "todo"}`}
                                          onClick={() =>
                                            handleToggleSolved(
                                              problem,
                                              topic.topicName,
                                            )
                                          }
                                          title={
                                            isSolved
                                              ? "Click to mark as Unsolved"
                                              : "Click to mark as Solved"
                                          }
                                        >
                                          {isSolved ? "Solved" : "Todo"}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
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
