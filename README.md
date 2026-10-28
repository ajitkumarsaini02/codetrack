# 🌲 CodeTrack — Cross-Platform Coding & DSA Progress Tracker

CodeTrack is a fullstack developer platform designed for software engineers and competitive programmers to track, log, and analyze their Data Structures and Algorithms (DSA) practice across platforms like **LeetCode**, **Codeforces**, **CodeChef**, **GeeksforGeeks**, and **GitHub**.

<br />

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[![License: ISC](https://img.shields.io/badge/License-ISC-007EC6?style=for-the-badge)](https://opensource.org/licenses/ISC)

</div>

---

## 🌟 Key Features

- **Multi-Platform Statistics Sync**: Automatically fetch public statistics, problem solved counts, ratings, and rankings across supported platforms (**LeetCode**, **Codeforces**, **CodeChef**, **GeeksforGeeks**, and **GitHub**).
- **Curated DSA Mastery Sheets**: Structured roadmaps covering **LeetCode (947 problems across 22 phases and 115 topics)** and **Codeforces (500 problems in strict sequential order)** with interactive checkbox tracking.
- **Interactive DSA Problem Tracker**: Organize custom problems by platform, topic, difficulty (Easy, Medium, Hard), and status (Todo, Attempted, Solved). Includes URL links and custom tags.
- **Activity & Analytics Dashboard**: Real-time visual progress breakdowns with Recharts area charts, streak tracking, daily problem goals, and difficulty distribution.
- **Community Leaderboard**: Global rankings based on total problems solved and peak contest ratings with podium medals.
- **Forest Green, Warm Cream & Terracotta UI**: Distinctive developer SaaS aesthetic featuring deep forest charcoal surfaces in dark mode, warm cream ivory in light mode, and terracotta accent highlights.
- **Seamless Dark & Light Mode**: Comprehensive theme switching persisted across sessions with zero flash of unstyled content.
- **Secure Authentication**: Built with JWT (JSON Web Tokens), bcrypt password hashing, HTTP security headers via Helmet, and rate limiting.

---

## 🎨 Design System: Forest Green, Warm Cream & Terracotta

CodeTrack uses a centralized design system built on CSS variables:

### Dark Mode (`[data-theme="dark"]`)
| Token | Hex | Role |
| :--- | :--- | :--- |
| `--background` | `#111812` | Deep forest canvas |
| `--sidebar` / `--navbar` | `#151F18` | Navigation surfaces |
| `--card` | `#1D2A20` | Primary card panels |
| `--surface-elevated` | `#263529` | Hover states & elevated controls |
| `--border` | `#354638` | Muted stone dividers |
| `--primary` | `#315B40` | Forest green brand & primary buttons |
| `--accent` | `#739775` | Sage green indicators |
| `--terracotta` | `#D47E62` | Restrained highlights, active pips & hard diff |
| `--text-primary` | `#F4F0E5` | Warm cream primary text |
| `--text-secondary` | `#B5BEAE` | Sage muted secondary text |

### Light Mode (`[data-theme="light"]`)
| Token | Hex | Role |
| :--- | :--- | :--- |
| `--background` | `#F5F0E5` | Warm cream canvas |
| `--sidebar` | `#FBF8F0` | Light cream sidebar |
| `--navbar` / `--card` | `#FFFFFF` / `#FFFCF5` | Clean white/ivory cards |
| `--surface-elevated` | `#EFE7D7` | Warm stone elevated controls |
| `--border` | `#DED5C4` | Soft stone borders |
| `--primary` | `#315B40` | Forest green primary brand |
| `--accent` | `#739775` | Sage green accent |
| `--terracotta` | `#B95F45` | Deep terracotta highlight |
| `--text-primary` | `#24352A` | Deep forest text |
| `--text-secondary` | `#626C5F` | Slate green secondary text |

---

## 🛠️ Tech Stack

### Core Technologies

| Category | Badges | Details |
| :--- | :--- | :--- |
| **Frontend** | [![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/) | React 19 SPA powered by Vite 8 build engine with hot module replacement |
| **Backend** | [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/) | RESTful API architecture built on Express.js 5 and Node.js |
| **Database & ODM** | [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Mongoose 9](https://img.shields.io/badge/Mongoose_9-880000?style=flat-square&logo=mongoose&logoColor=white)](https://mongoosejs.com/) | Document store with schemas, compound indexing and aggregation pipelines |
| **Routing** | [![React Router 7](https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/) | Declarative client-side routing with responsive nested shells |
| **Analytics & Charts** | [![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=d3dotjs&logoColor=white)](https://recharts.org/) | Responsive SVG area charts with custom tooltips & active markers |
| **Security & Auth** | [![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/) [![Helmet](https://img.shields.io/badge/Helmet-000000?style=flat-square&logo=helmet&logoColor=white)](https://helmetjs.github.io/) | Stateless JWT auth, bcryptjs password hashing, rate limiting & CORS |
| **UI & Icons** | [![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square&logo=feather&logoColor=white)](https://lucide.dev/) [![CSS Variables](https://img.shields.io/badge/CSS_Design_System-315B40?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) | Forest Green, Warm Cream & Terracotta Design System with dark/light themes |

### Supported Coding Platforms

[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=LeetCode&logoColor=black)](https://leetcode.com/)
[![Codeforces](https://img.shields.io/badge/Codeforces-1F8ACB?style=for-the-badge&logo=Codeforces&logoColor=white)](https://codeforces.com/)
[![CodeChef](https://img.shields.io/badge/CodeChef-5B4638?style=for-the-badge&logo=CodeChef&logoColor=white)](https://www.codechef.com/)
[![GeeksforGeeks](https://img.shields.io/badge/GeeksforGeeks-298D46?style=for-the-badge&logo=GeeksforGeeks&logoColor=white)](https://www.geeksforgeeks.org/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/)

---

## 📁 Repository Structure

```text
codetrack/
├── backend/                  # Node.js + Express REST API
│   ├── scripts/              # Utility scripts (providers check, migrations)
│   ├── src/
│   │   ├── config/           # Environment config and DB connection
│   │   ├── controllers/      # Route handlers (auth, dashboard, problems, sheets)
│   │   ├── data/             # Curated sheets dataset (sheetsData.json)
│   │   ├── middleware/       # JWT auth, error handler, rate limits
│   │   ├── models/           # Mongoose schemas (User, Problem, Platform, Sheet)
│   │   ├── providers/        # LeetCode, Codeforces, CodeChef, GFG, GitHub scrapers
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic and platform sync services
│   │   └── server.js         # Backend entry point
│   ├── tests/                # Automated test suite (node --test)
│   ├── .env.example          # Sample environment variables
│   └── package.json
│
├── frontend/                 # React + Vite Single Page Application
│   ├── public/               # Scalable SVG logo, high-res PNG icons, PWA manifest
│   ├── src/
│   │   ├── components/       # UI components (Logo, Sidebar, Navbar, StatCard, Chart)
│   │   ├── context/          # AuthContext, ThemeContext providers
│   │   ├── hooks/            # Custom hooks (useAuth, useTheme, useProblems)
│   │   ├── layouts/          # MainLayout (responsive shell), AuthLayout
│   │   ├── pages/            # Dashboard, Sheets, Problems, Leaderboard, Profile, Settings
│   │   ├── services/         # Axios API client (auth, dashboard, problems, sheets)
│   │   ├── App.css           # Component & layout design system rules
│   │   ├── index.css         # Core CSS tokens (Dark & Light modes)
│   │   └── main.jsx          # React DOM entry point
│   └── package.json
│
├── docs/                     # Architectural & API documentation
│   ├── api-documentation.md  # REST API specification
│   ├── architecture.md       # High-level architecture & request flow
│   └── database-schema.md    # MongoDB database schema details
│
├── DEPLOYMENT.md             # Production deployment guide (Render + Vercel)
├── package.json              # Monorepo scripts (dev, build, lint, test)
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or via MongoDB Atlas)

### 2. Environment Configuration

In `backend/.env` (copy from `backend/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codetrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Installation

Install dependencies across all workspaces:

```bash
npm run install:all
```

### 4. Running the Development Servers

Run both backend and frontend concurrently:

```bash
npm run dev
```

Or run them individually:

```bash
# Terminal 1 - Backend (http://localhost:5000)
npm run dev:backend

# Terminal 2 - Frontend (http://localhost:5173)
npm run dev:frontend
```

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account (`name`, `username`, `email`, `password`) | No |
| `POST` | `/auth/login` | Authenticate user and receive JWT | No |
| `GET` | `/auth/me` | Get currently authenticated profile | Bearer Token |

### Coding Platforms & Live Sync
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/platforms` | Get user's linked platforms | Bearer Token |
| `POST` | `/platforms` | Link coding handle (`platform`, `username`) | Bearer Token |
| `DELETE` | `/platforms/:id` | Unlink coding handle | Bearer Token |
| `POST` | `/platforms/sync` | Trigger live stats sync across all linked platforms | Bearer Token |
| `POST` | `/platforms/sync/:platform` | Trigger live sync for a single platform | Bearer Token |

### Curated DSA Mastery Sheets
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/sheets` | Get list of curated sheets with progress summary | Optional |
| `GET` | `/sheets/:sheetId` | Get full roadmap, phases, topics and problem items | Optional |
| `POST` | `/sheets/:sheetId/progress` | Toggle solved status of a curated sheet problem | Bearer Token |

### DSA Practice Problems
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/problems` | List problems with filters (`difficulty`, `status`, `page`, `limit`) | Bearer Token |
| `POST` | `/problems` | Create new problem record | Bearer Token |
| `GET` | `/problems/:id` | Get problem details | Bearer Token |
| `PUT` | `/problems/:id` | Update problem (status, notes, etc.) | Bearer Token |
| `DELETE` | `/problems/:id` | Delete problem | Bearer Token |

### Dashboard, Analytics & Settings
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | User summary, platform totals, rating peaks, weekly activity | Bearer Token |
| `GET` | `/analytics` | Difficulty, status, and topic distributions | Bearer Token |
| `GET` | `/leaderboard` | Paginated leaderboard rankings across all users | Optional |
| `PUT` | `/settings` | Update daily problem goal and theme preferences | Bearer Token |

---

## 🧪 Testing & Verification

Run backend automated tests:

```bash
npm test
```

Run frontend linter and production build:

```bash
cd frontend
npm run lint
npm run build
```

---

## 🔒 Security Best Practices

- Passwords hashed using `bcryptjs` with salt round factor `12`.
- Secure JWT payload verification with configurable expiration.
- Express Rate Limiting to prevent brute-force attacks on API endpoints.
- Helmet security headers and CORS protection restricting unauthorized origins.

---

## 📝 License

Distributed under the ISC License. Built with ❤️ for competitive programmers and software engineers.
