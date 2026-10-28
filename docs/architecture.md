# CodeTrack System Architecture 🏗️

## 1. System Overview

CodeTrack is a fullstack web application that unifies coding progress, competitive programming metrics, and structured DSA roadmaps into a cohesive developer dashboard.

The application uses an asynchronous REST API backend powered by Node.js and MongoDB, coupled with a reactive frontend built with React 19, Vite, and a custom **Forest Green, Warm Cream & Terracotta** design system.

---

## 2. High-Level Architecture Diagram

```text
                                  [ User ]
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │        React 19 + Vite Frontend         │
                │  - Forest Green & Warm Cream CSS System │
                │  - React Router 7 + Lucide Icons        │
                │  - Recharts Area Visualization          │
                └────────────────────┬────────────────────┘
                                     │
                            HTTPS / Axios API Client
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │          Express.js 5 REST API          │
                │  - JWT & Rate-Limiting Security Layer   │
                │  - Helmet & CORS Headers                │
                │  - Controller & Service Architecture    │
                └────────┬──────────────────────┬─────────┘
                         │                      │
             Mongoose ODM Query                 │ External Platform Scraping
                         │                      │ (LeetCode, CF, CodeChef, GFG)
                         ▼                      ▼
                ┌────────────────┐    ┌───────────────────┐
                │    MongoDB     │    │   External APIs   │
                │ Atlas / Local  │    │  & GraphQL Endpts │
                └────────────────┘    └───────────────────┘
```

---

## 3. Frontend Architecture

### Directory Breakdown

```text
frontend/
├── public/                 # Brand assets, scalable SVGs & HD icons
├── src/
│   ├── components/         # Reusable presentation components
│   │   ├── ActivityChart.jsx   # Weekly activity Recharts visualization
│   │   ├── Button.jsx          # Semantic primary/secondary/terracotta buttons
│   │   ├── EmptyState.jsx      # Generic empty state illustration
│   │   ├── Header.jsx          # Page header with titles and action slots
│   │   ├── Logo.jsx            # Dynamic inline vector brand mark
│   │   ├── Navbar.jsx          # Top navbar, search, notifications, theme
│   │   ├── PlatformCard.jsx    # Live profile statistics and sync controls
│   │   ├── ProblemTable.jsx    # Problem management data table
│   │   ├── ProgressBar.jsx     # Linear multi-color progress indicators
│   │   ├── Sidebar.jsx         # Grouped navigation with active state
│   │   └── StatCard.jsx        # Metric summary card
│   ├── context/            # Global context state
│   │   ├── AuthContext.jsx     # User authentication & session handling
│   │   └── ThemeContext.jsx    # Dual theme (dark/light) management
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useTheme.js         # Theme toggle hook
│   │   └── useProblems.js      # Problems query hook
│   ├── layouts/            # Page layout wrappers
│   │   ├── MainLayout.jsx      # Core dashboard shell (sidebar + navbar + content)
│   │   └── AuthLayout.jsx      # Centered authentication shell
│   ├── pages/              # Application views
│   │   ├── Dashboard.jsx       # Real-time KPIs, charts, linked platforms
│   │   ├── Sheets.jsx          # 1,447+ curated LeetCode & Codeforces roadmaps
│   │   ├── Problems.jsx        # Problem bank with filtering and status updates
│   │   ├── Leaderboard.jsx     # Global rankings with podium badges
│   │   ├── Profile.jsx         # User identity and profile links
│   │   ├── Settings.jsx        # Profile, daily goal, and theme preferences
│   │   ├── Login.jsx           # Sign in view
│   │   └── Register.jsx        # Sign up view
│   ├── services/
│   │   └── api.js              # Centralized Axios client with token interceptors
│   ├── App.css             # Component styling and layout rules
│   └── index.css           # Global tokens (Forest Green, Warm Cream & Terracotta)
```

---

## 4. Backend Architecture

### Design Patterns
* **Controller-Service Layer**: Controllers handle HTTP validation and response serialization, while services contain business logic, multi-platform aggregation, and database queries.
* **Provider Adapters**: Independent client adapters for each competitive programming platform (`LeetCodeProvider`, `CodeforcesProvider`, `CodeChefProvider`, `GeeksforGeeksProvider`, `GitHubProvider`) implementing normalized data structures.
* **Resilient Data Synchronization**: Platform sync operations execute with individual error boundaries so one failing external provider does not interrupt the entire sync cycle.

---

## 5. Security & Reliability

* **Password Security**: Passwords hashed using `bcryptjs` with salt round factor 12.
* **Authentication**: Stateless JSON Web Tokens (JWT) verified via Express middleware.
* **API Rate Limiting**: Global and endpoint-specific rate limiting via `express-rate-limit`.
* **CORS Protection**: Whitelisted origin matching supporting local development and production Vercel domains.
* **Content Security**: Helmet headers applied to sanitize response headers.
