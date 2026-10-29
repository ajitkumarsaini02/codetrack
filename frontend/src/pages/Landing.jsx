import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  Target,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  ExternalLink,
  Check,
  BarChart3,
  Compass,
} from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  const platforms = [
    {
      id: "leetcode",
      name: "LeetCode",
      color: "#F59E0B",
      bgSubtle: "rgba(245, 158, 11, 0.12)",
      tagline: "DSA & Interview Prep",
      description:
        "Sync Easy, Medium, and Hard problem counts, active streak, and contest rating badges automatically.",
      features: [
        "Easy / Medium / Hard split",
        "Contest Rating & Badges",
        "Topic tag mastery",
      ],
    },
    {
      id: "codeforces",
      name: "Codeforces",
      color: "#60A5FA",
      bgSubtle: "rgba(96, 165, 250, 0.12)",
      tagline: "Competitive Programming",
      description:
        "Track your live contest rating, division rank title (Candidate Master, Specialist), and contest performance.",
      features: [
        "Live Elo Contest Rating",
        "Official Rank Tier",
        "Division contest history",
      ],
    },
    {
      id: "codechef",
      name: "CodeChef",
      color: "#8B5CF6",
      bgSubtle: "rgba(139, 92, 246, 0.12)",
      tagline: "Contest Ladders",
      description:
        "Monitor Star tiers (1★ to 7★), global rank, and Starters / Cook-Off contest points in real time.",
      features: [
        "Star Rating (1★–7★)",
        "Global & Country Ranks",
        "Contest division ratings",
      ],
    },
    {
      id: "gfg",
      name: "GeeksforGeeks",
      color: "#22A06B",
      bgSubtle: "rgba(34, 160, 107, 0.12)",
      tagline: "Foundations & Practice",
      description:
        "Aggregate your solved problem scores, institute leaderboard standing, and POTD consistency.",
      features: [
        "Overall Coding Score",
        "Institute Rank",
        "Practice track completion",
      ],
    },
  ];

  const features = [
    {
      icon: Layers,
      title: "1,440+ Curated DSA Sheets",
      description:
        "Structured sequential roadmaps covering 115 topics with LeetCode (947 questions) and Codeforces (500 ladder questions).",
    },
    {
      icon: RefreshCw,
      title: "1-Click Background Sync",
      description:
        "Enter your public handles once. CodeTrack fetches all your solved questions and contest ratings with zero passwords.",
    },
    {
      icon: Target,
      title: "Daily Goals & Streaks",
      description:
        "Set personalized daily targets, build consistency, and watch your activity heatmap light up week after week.",
    },
    {
      icon: BarChart3,
      title: "Contest Rating Analytics",
      description:
        "Visualize rating progressions over time with integrated line graphs and track your peak competitive milestones.",
    },
    {
      icon: Compass,
      title: "Spaced Repetition & Notes",
      description:
        "Flag difficult questions for automatic revision reminders before your upcoming technical interviews.",
    },
    {
      icon: ShieldCheck,
      title: "100% Free & Privacy-First",
      description:
        "Open-source developer tool. We never ask for platform passwords or credentials. Only your public username is needed.",
    },
  ];

  const faqs = [
    {
      q: "Is CodeTrack completely free to use?",
      a: "Yes! CodeTrack is 100% free and open-source for developers. There are no paywalls, hidden subscriptions, or premium locks.",
    },
    {
      q: "Do I need to share my platform passwords?",
      a: "Never! CodeTrack only asks for your public platform usernames (e.g., your LeetCode handle). We fetch your verified stats via public APIs without ever touching your credentials.",
    },
    {
      q: "Can I practice curated DSA sheets as a guest?",
      a: "Absolutely. You can open our DSA Sheets and check off solved questions right away. Your progress is saved in your browser localStorage, and you can sign in anytime to sync to the cloud.",
    },
    {
      q: "Which platforms are currently supported for synchronization?",
      a: "CodeTrack currently synchronizes verified profiles from LeetCode, Codeforces, CodeChef, and GeeksforGeeks, with GitHub activity tracking coming soon.",
    },
    {
      q: "How are the DSA Mastery Sheets curated?",
      a: "Our LeetCode sheet contains 947 top interview questions spanning 22 phases and 115 sequential topics (10 questions per topic baseline). The Codeforces sheet features 500 problems categorized by rating ladders (★ 800 to 2600).",
    },
  ];

  return (
    <div className="landing-page">
      {/* Top Navigation Bar */}
      <header className="landing-nav-wrapper">
        <div className="landing-nav-container">
          <Link to="/" className="landing-brand">
            <Logo size={30} />
            <span className="landing-brand-text">CodeTrack</span>
            <span className="landing-brand-badge">PRO</span>
          </Link>

          <nav className="landing-nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#sheets" className="nav-link">
              Curated Sheets
            </a>
            <a href="#platforms" className="nav-link">
              Platforms
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="landing-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                className="button button-primary landing-cta-btn"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link to="/login" className="landing-login-btn">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="button button-primary landing-cta-btn"
                >
                  Get Started Free <ArrowRight size={16} />
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="landing-mobile-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              Features
            </a>
            <a
              href="#sheets"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              Curated Sheets
            </a>
            <a
              href="#platforms"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              Platforms
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              FAQ
            </a>
            <div className="mobile-nav-auth">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="button button-primary mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="button button-secondary mobile-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="button button-primary mobile-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Free Account →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-chip">
            <Sparkles size={14} className="chip-sparkle" />
            <span>The Unified Competitive Programming Workspace</span>
          </div>

          <h1 className="landing-hero-title">
            Track Practice. Build Consistency.
            <span className="gradient-highlight"> Dominate DSA.</span>
          </h1>

          <p className="landing-hero-subtitle">
            Connect your{" "}
            <strong>LeetCode, Codeforces, CodeChef, and GeeksforGeeks</strong>{" "}
            profiles into one sleek dashboard. Master 1,440+ curated roadmap
            questions, monitor daily streaks, and visualize contest ratings with
            zero friction.
          </p>

          <div className="landing-hero-cta-group">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="button button-primary hero-btn-main"
            >
              <span>
                {isAuthenticated
                  ? "Open Your Dashboard"
                  : "Start Tracking Free"}
              </span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/sheets"
              className="button button-secondary hero-btn-secondary"
            >
              <Layers size={18} />
              <span>Explore Curated Sheets</span>
            </Link>
          </div>

          <div className="landing-hero-trust-bar">
            <div className="trust-item">
              <Check size={16} className="trust-check" />
              <span>1,447+ Curated Problems</span>
            </div>
            <div className="trust-item">
              <Check size={16} className="trust-check" />
              <span>4+ Platforms Synced</span>
            </div>
            <div className="trust-item">
              <Check size={16} className="trust-check" />
              <span>Zero Passwords Required</span>
            </div>
            <div className="trust-item">
              <Check size={16} className="trust-check" />
              <span>100% Free Forever</span>
            </div>
          </div>
        </div>

        {/* Realistic Interactive Dashboard Mockup Preview */}
        <div className="landing-hero-preview-wrapper">
          <div className="hero-preview-browser">
            <div className="browser-header">
              <div className="browser-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="browser-address">
                <span>codetrack.dev/dashboard</span>
              </div>
              <div className="browser-actions">
                <span className="browser-badge">LIVE DASHBOARD</span>
              </div>
            </div>

            <div className="browser-screen">
              {/* Mock Dashboard Representation */}
              <div className="mock-dashboard">
                <div className="mock-dash-header">
                  <div>
                    <h3 className="mock-welcome">Welcome back, Developer</h3>
                    <p className="mock-sub">
                      Track your coding journey and real-time DSA progress.
                    </p>
                  </div>
                  <div className="mock-sync-pill">
                    <RefreshCw size={13} className="spin-slow" />
                    <span>Platforms Synced</span>
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="mock-kpi-grid">
                  <div className="mock-kpi-card">
                    <span className="mock-kpi-label">PROBLEMS SOLVED</span>
                    <strong className="mock-kpi-val">203</strong>
                    <span className="mock-kpi-sub">
                      Total problems completed
                    </span>
                  </div>
                  <div className="mock-kpi-card">
                    <span className="mock-kpi-label">CONTEST RATING</span>
                    <strong className="mock-kpi-val rating">1,842</strong>
                    <span className="mock-kpi-sub">Codeforces Specialist</span>
                  </div>
                  <div className="mock-kpi-card">
                    <span className="mock-kpi-label">DSA SHEET SOLVED</span>
                    <strong className="mock-kpi-val sheets">199</strong>
                    <span className="mock-kpi-sub">
                      Curated LeetCode catalog
                    </span>
                  </div>
                  <div className="mock-kpi-card">
                    <span className="mock-kpi-label">DAILY GOAL</span>
                    <strong className="mock-kpi-val goal">2 / 2</strong>
                    <span className="mock-kpi-sub">
                      Goal completed today! 🎉
                    </span>
                  </div>
                </div>

                {/* Mock Split Panels: Activity Graph & DSA Tracker */}
                <div className="mock-panels-split">
                  <div className="mock-panel mock-activity">
                    <div className="mock-panel-title">
                      <h4>Activity Overview</h4>
                      <span>This week</span>
                    </div>
                    <div className="mock-chart-bars">
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "45%" }} />
                        <span>Mon</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "80%" }} />
                        <span>Tue</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "60%" }} />
                        <span>Wed</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "95%" }} />
                        <span>Thu</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "70%" }} />
                        <span>Fri</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "100%" }} />
                        <span>Sat</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: "85%" }} />
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>

                  <div className="mock-panel mock-dsa">
                    <div className="mock-panel-title">
                      <h4>DSA Progress Tracker</h4>
                      <span className="mock-dsa-badge">203 SOLVED</span>
                    </div>
                    <div className="mock-dsa-bars">
                      <div className="dsa-bar-row">
                        <div className="dsa-bar-meta">
                          <span>Easy</span>
                          <strong>120 / 850</strong>
                        </div>
                        <div className="dsa-track">
                          <div
                            className="dsa-fill easy"
                            style={{ width: "35%" }}
                          />
                        </div>
                      </div>
                      <div className="dsa-bar-row">
                        <div className="dsa-bar-meta">
                          <span>Medium</span>
                          <strong>70 / 1,750</strong>
                        </div>
                        <div className="dsa-track">
                          <div
                            className="dsa-fill medium"
                            style={{ width: "22%" }}
                          />
                        </div>
                      </div>
                      <div className="dsa-bar-row">
                        <div className="dsa-bar-meta">
                          <span>Hard</span>
                          <strong>13 / 750</strong>
                        </div>
                        <div className="dsa-track">
                          <div
                            className="dsa-fill hard"
                            style={{ width: "12%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms Section */}
      <section id="platforms" className="landing-section platforms-section">
        <div className="section-header">
          <span className="section-badge">PLATFORM INTEGRATIONS</span>
          <h2 className="section-title">
            All Your Competitive Profiles In One Place
          </h2>
          <p className="section-subtitle">
            Link your public usernames once. CodeTrack fetches your solved
            problems, contest ratings, and submission streaks automatically.
          </p>
        </div>

        <div className="platforms-grid">
          {platforms.map((plat) => (
            <div key={plat.id} className="platform-landing-card">
              <div className="plat-card-header">
                <div
                  className="plat-icon-box"
                  style={{ backgroundColor: plat.bgSubtle, color: plat.color }}
                >
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 className="plat-name">{plat.name}</h3>
                  <span className="plat-tagline">{plat.tagline}</span>
                </div>
              </div>

              <p className="plat-desc">{plat.description}</p>

              <div className="plat-features-list">
                {plat.features.map((feat, i) => (
                  <div key={i} className="plat-feat-item">
                    <CheckCircle2 size={15} style={{ color: plat.color }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated DSA Sheets Roadmap Section */}
      <section id="sheets" className="landing-section sheets-section">
        <div className="section-header">
          <span className="section-badge">CURATED ROADMAPS</span>
          <h2 className="section-title">
            Structured Practice. Zero Guesswork.
          </h2>
          <p className="section-subtitle">
            Stop searching across random tutorials. Practice with two
            production-grade, sequentially organized roadmap sheets designed for
            technical interviews and competitive ladders.
          </p>
        </div>

        <div className="sheets-showcase-grid">
          {/* LeetCode Sheet Card */}
          <div className="sheet-showcase-card leetcode">
            <div className="sheet-showcase-top">
              <span className="sheet-platform-pill leetcode">LEETCODE</span>
              <span className="sheet-phase-tag">22 Sequential Phases</span>
            </div>

            <h3 className="sheet-showcase-title">LeetCode DSA Mastery Sheet</h3>
            <p className="sheet-showcase-desc">
              Comprehensive curated roadmap covering all 115 sequential DSA
              topics, with exactly 10 questions baseline per topic and full
              coverage of unique interview problems.
            </p>

            <div className="sheet-showcase-stats">
              <div className="stat-box">
                <span className="stat-label">Curated Questions</span>
                <strong className="stat-value">947</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Topic Coverage</span>
                <strong className="stat-value">115 Topics</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Progress Tracking</span>
                <strong className="stat-value">Real-Time</strong>
              </div>
            </div>

            <Link
              to="/sheets"
              className="button button-primary sheet-action-btn"
            >
              <span>Start LeetCode Sheet</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Codeforces Sheet Card */}
          <div className="sheet-showcase-card codeforces">
            <div className="sheet-showcase-top">
              <span className="sheet-platform-pill codeforces">CODEFORCES</span>
              <span className="sheet-phase-tag">22 Rating Ladders</span>
            </div>

            <h3 className="sheet-showcase-title">
              Codeforces DSA Mastery Sheet
            </h3>
            <p className="sheet-showcase-desc">
              Topic-wise curated Codeforces problems organized by strict rating
              ladders (★ 800 to 2600), preparing you to advance through Div 3,
              Div 2, and Div 1 contests.
            </p>

            <div className="sheet-showcase-stats">
              <div className="stat-box">
                <span className="stat-label">Curated Questions</span>
                <strong className="stat-value">500</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rating Ladders</span>
                <strong className="stat-value">★ 800–2600</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Progress Tracking</span>
                <strong className="stat-value">Real-Time</strong>
              </div>
            </div>

            <Link
              to="/sheets"
              className="button button-primary sheet-action-btn codeforces"
            >
              <span>Start Codeforces Sheet</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Bento Grid */}
      <section id="features" className="landing-section features-section">
        <div className="section-header">
          <span className="section-badge">CORE FEATURES</span>
          <h2 className="section-title">Built For Engineers Who Code Daily</h2>
          <p className="section-subtitle">
            Every feature is designed around deliberate practice, speed, and
            clean ergonomics.
          </p>
        </div>

        <div className="features-bento-grid">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="feature-bento-card">
                <div className="feature-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="landing-section steps-section">
        <div className="section-header">
          <span className="section-badge">WORKFLOW</span>
          <h2 className="section-title">Up and Running in 30 Seconds</h2>
          <p className="section-subtitle">
            Simple, frictionless setup with zero password requirements.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Create Free Account</h3>
            <p className="step-desc">
              Sign up in seconds. You can also explore curated sheets
              immediately as a guest.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3 className="step-title">Link Public Handles</h3>
            <p className="step-desc">
              Enter your LeetCode, Codeforces, CodeChef, and GeeksforGeeks
              handles under Connected Platforms.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3 className="step-title">Track, Practice & Dominate</h3>
            <p className="step-desc">
              Hit your daily goals, track your rating curves, and systematically
              conquer the curated sheets.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-section faq-section">
        <div className="section-header">
          <span className="section-badge">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Got Questions? We Have Answers.</h2>
        </div>

        <div className="faq-container">
          {faqs.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "open" : ""}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-question">{item.q}</h4>
                  <button
                    type="button"
                    className="faq-toggle-btn"
                    aria-label="Toggle FAQ answer"
                  >
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
                {isOpen && <p className="faq-answer">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <span className="cta-chip">Ready to Start?</span>
          <h2 className="cta-title">
            Take Control of Your DSA & Competitive Journey
          </h2>
          <p className="cta-subtitle">
            Join developers building consistency, tracking their progress, and
            landing top engineering roles.
          </p>

          <div className="cta-actions">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="button button-primary cta-btn-main"
            >
              <span>
                {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
              </span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/sheets"
              className="button button-secondary cta-btn-secondary"
            >
              <span>Practice Sheets as Guest</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Logo size={26} />
              <span>CodeTrack</span>
              <span className="landing-brand-badge">PRO</span>
            </div>
            <p className="footer-desc">
              The unified developer workspace for competitive programming
              practice, contest rating tracking, and curated DSA roadmap
              mastery.
            </p>
            <div className="footer-tech-stack">
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">Express</span>
              <span className="tech-badge">MongoDB</span>
              <span className="tech-badge">Vite</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Workspace</h4>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              Dashboard
            </Link>
            <Link to="/sheets">Curated DSA Sheets</Link>
            <Link to={isAuthenticated ? "/problems" : "/login"}>
              Problem Tracker
            </Link>
            <Link to={isAuthenticated ? "/leaderboard" : "/login"}>
              Leaderboard
            </Link>
          </div>

          <div className="footer-links-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to={isAuthenticated ? "/profile" : "/login"}>Profile</Link>
            <Link to={isAuthenticated ? "/settings" : "/login"}>Settings</Link>
          </div>

          <div className="footer-links-col">
            <h4>Resources</h4>
            <a
              href="https://github.com/ajitkumarsaini02/codetrack"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository{" "}
              <ExternalLink size={12} className="inline-ext" />
            </a>
            <a href="#features">Features Guide</a>
            <a href="#faq">FAQ</a>
            <a href="#platforms">Supported Platforms</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CodeTrack. Built with Forest Green,
            Warm Cream & Terracotta aesthetic.
          </p>
          <div className="footer-bottom-links">
            <span>Free & Open Source</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
