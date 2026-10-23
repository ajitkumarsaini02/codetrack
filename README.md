# CodeTrack 🚀

> **Unified Cross-Platform DSA & Coding Progress Tracker**

CodeTrack is a fullstack web application designed for software engineers and competitive programmers to monitor, log, and analyze their Data Structures and Algorithms (DSA) practice across platforms like **LeetCode**, **Codeforces**, **CodeChef**, **GeeksforGeeks**, and **GitHub**.

---

## 🌟 Key Features

- **Multi-Platform Statistics Sync**: Automatically fetch public statistics, problem solved counts, ratings, and rankings across supported platforms (**LeetCode**, **Codeforces**, **CodeChef**, **GeeksforGeeks**, and **GitHub**).
- **Interactive DSA Problem Tracker**: Organize problems by platform, topic, difficulty (Easy, Medium, Hard), and status (Todo, Attempted, Solved). Includes URL links and custom tags.
- **Activity & Analytics Dashboard**: Real-time visual progress breakdowns with Recharts charts, streak calculations, and target goals.
- **Community Leaderboard**: Global rankings based on total problems solved and peak contest ratings.
- **Secure Authentication**: Built with JWT (JSON Web Tokens), bcrypt password hashing, HTTP security headers via Helmet, and rate limiting.
- **Modern Glassmorphic UI**: High-contrast dark theme built with React 19, Lucide icons, and optimized CSS.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                   |
| ------------ | ---------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Recharts, Lucide React              |
| **Backend**  | Node.js, Express.js 5, Mongoose 9, JWT, bcryptjs, Helmet, Express Rate Limit |
| **Database** | MongoDB                                                                      |
| **Styling**  | Vanilla CSS Design System with responsive layouts                            |

---

## 📁 Repository Structure

```text
codetrack/
├── backend/                  # Node.js + Express REST API
│   ├── scripts/              # Utility scripts (providers check, migrations)
│   ├── src/
│   │   ├── config/           # Environment config and DB connection
│   │   ├── controllers/      # Route handler logic
│   │   ├── middleware/       # JWT auth, error handler, rate limits
│   │   ├── models/           # Mongoose database schemas
│   │   ├── providers/        # LeetCode, Codeforces, CodeChef, GFG, GitHub API clients
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic and platform sync
│   │   └── server.js         # Backend entry point
│   ├── tests/                # Automated test suite (node --test)
│   ├── .env.example          # Sample environment variables
│   └── package.json
│
├── frontend/                 # React + Vite Single Page Application
│   ├── public/               # Logos, icons, background images, manifest
│   ├── src/
│   │   ├── components/       # Reusable UI components (Sidebar, Tables, Charts)
│   │   ├── context/          # AuthContext provider
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── layouts/          # MainLayout, AuthLayout, BlankLayout
│   │   ├── pages/            # Dashboard, Problems, Leaderboard, Profile, Login, Register
│   │   ├── services/         # Axios API service client
│   │   ├── App.jsx           # Main routing configuration
│   │   └── main.jsx          # React DOM root
│   └── package.json
│
├── docs/                     # Architectural & API documentation
│   ├── api-documentation.md  # REST API specification
│   ├── architecture.md       # High-level architecture & request flow
│   └── database-schema.md    # MongoDB database schema details
│
├── .gitignore                # Git ignore patterns
├── package.json              # Monorepo workspace scripts
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or via MongoDB Atlas)

### 2. Environment Configuration

In `backend/.env` (copy from `backend/.env.example` if creating fresh):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codetrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Installation

Install dependencies across both services from the root folder:

```bash
npm run install:all
```

Or install individually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Running the Development Servers

Run both servers concurrently:

```bash
npm run dev
```

Or run them in separate terminals:

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

| Method | Endpoint         | Description                                                    | Auth Required |
| ------ | ---------------- | -------------------------------------------------------------- | ------------- |
| `POST` | `/auth/register` | Register new account (`name`, `username`, `email`, `password`) | No            |
| `POST` | `/auth/login`    | Authenticate user and receive JWT                              | No            |
| `GET`  | `/auth/me`       | Get currently authenticated profile                            | Bearer Token  |

### Coding Platforms & Sync

| Method   | Endpoint          | Description                                         | Auth Required |
| -------- | ----------------- | --------------------------------------------------- | ------------- |
| `GET`    | `/platforms`      | Get user's linked platforms                         | Bearer Token  |
| `POST`   | `/platforms`      | Link coding handle (`platform`, `username`)         | Bearer Token  |
| `DELETE` | `/platforms/:id`  | Unlink coding handle                                | Bearer Token  |
| `POST`   | `/platforms/sync` | Trigger live stats sync across all linked platforms | Bearer Token  |

### DSA Problems

| Method   | Endpoint        | Description                                                          | Auth Required |
| -------- | --------------- | -------------------------------------------------------------------- | ------------- |
| `GET`    | `/problems`     | List problems with filters (`difficulty`, `status`, `page`, `limit`) | Bearer Token  |
| `POST`   | `/problems`     | Create new problem record                                            | Bearer Token  |
| `GET`    | `/problems/:id` | Get problem details                                                  | Bearer Token  |
| `PUT`    | `/problems/:id` | Update problem (status, notes, etc.)                                 | Bearer Token  |
| `DELETE` | `/problems/:id` | Delete problem                                                       | Bearer Token  |

### Dashboard & Analytics

| Method | Endpoint       | Description                                             | Auth Required |
| ------ | -------------- | ------------------------------------------------------- | ------------- |
| `GET`  | `/dashboard`   | Aggregated user summary, platform totals, and revisions | Bearer Token  |
| `GET`  | `/analytics`   | Detailed difficulty, status, and topic distributions    | Bearer Token  |
| `GET`  | `/leaderboard` | Paginated leaderboard rankings across all users         | Optional      |

---

## 🧪 Testing

Run backend automated tests:

```bash
npm test
```

Run test suite directly inside `backend/`:

```bash
cd backend
npm test
```

Run platform API scraper verification:

```bash
cd backend
npm run check:providers
```

Run frontend linter and build check:

```bash
cd frontend
npm run lint
npm run build
```

---

## 🔒 Security Best Practices

- Passwords hashed using `bcryptjs` with salt round factor `12`.
- Secure JWT payload verification with strict expiration.
- Rate limiting on public and authentication routes to mitigate brute force attacks.
- Helmet security headers and CORS protection restricting unauthorized origins.

---

## 📝 License

Distributed under the ISC License. Built with ❤️ for competitive programmers and developers.
