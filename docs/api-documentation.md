# CodeTrack API Documentation 📡

## 1. Overview

CodeTrack provides a RESTful API for tracking coding practice, multi-platform profile statistics (LeetCode, Codeforces, CodeChef, GeeksforGeeks, GitHub), curated DSA mastery sheets, and community leaderboards.

* **Base URL:** `http://localhost:5000/api`
* **Production Base URL:** `https://your-backend.onrender.com/api`
* **Authentication:** Bearer JWT in the `Authorization` header

---

## 2. Health Check

### GET `/health`
Check backend server status and database connectivity.

**Response (200 OK):**
```json
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "message": "CodeTrack backend is healthy"
}
```

---

## 3. Authentication Endpoints

### POST `/auth/register`
Register a new developer account.

**Request Body:**
```json
{
  "name": "Alex Dev",
  "username": "alexdev",
  "email": "alex@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "671fb2...",
    "name": "Alex Dev",
    "username": "alexdev",
    "email": "alex@example.com"
  }
}
```

### POST `/auth/login`
Authenticate with email and password.

**Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "SecurePassword123"
}
```

### GET `/auth/me`
Get current authenticated user profile.
* **Headers:** `Authorization: Bearer <token>`

---

## 4. Coding Platforms & Live Sync

### GET `/platforms`
Get user's connected coding handles and cached metrics.

### POST `/platforms`
Link a new coding platform handle.

**Request Body:**
```json
{
  "platform": "leetcode",
  "username": "tourist"
}
```

Supported `platform` values:
`leetcode`, `codeforces`, `codechef`, `gfg`, `github`.

### DELETE `/platforms/:id`
Unlink a connected coding platform.

### POST `/platforms/sync`
Trigger a real-time sync across all connected coding profiles.

### POST `/platforms/sync/:platform`
Trigger a live sync for a specific platform (e.g. `leetcode` or `codeforces`).

---

## 5. Curated DSA Mastery Sheets

### GET `/sheets`
Retrieve available curated roadmaps and overall user completion percentage.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "leetcode",
      "name": "LeetCode DSA Mastery Sheet",
      "tagline": "947 Curated Problems • 22 Phases • 115 Topics",
      "platform": "leetcode",
      "totalProblems": 947,
      "phaseCount": 22,
      "solvedCount": 45,
      "progressPercentage": 4.8
    },
    {
      "id": "codeforces",
      "name": "Codeforces DSA Mastery Sheet",
      "tagline": "500 Curated Problems • Strict Sequential Order",
      "platform": "codeforces",
      "totalProblems": 500,
      "phaseCount": 22,
      "solvedCount": 12,
      "progressPercentage": 2.4
    }
  ]
}
```

### GET `/sheets/:sheetId`
Get full topic-wise roadmap with phases, topics, difficulty ratings, and solved flags.
* Parameter `sheetId`: `leetcode` | `codeforces`

### POST `/sheets/:sheetId/progress`
Toggle solved status of a curated sheet problem for the authenticated user.

**Request Body:**
```json
{
  "problemTitle": "Two Sum",
  "status": "solved"
}
```

---

## 6. DSA Practice Problems

### GET `/problems`
Fetch custom user problems with filtering and pagination.

**Query Parameters:**
* `difficulty`: `Easy` | `Medium` | `Hard`
* `status`: `todo` | `attempted` | `solved`
* `page`: page number (default: 1)
* `limit`: records per page (default: 50, max: 2500)

### POST `/problems`
Add a custom practice problem.

**Request Body:**
```json
{
  "title": "Median of Two Sorted Arrays",
  "platform": "leetcode",
  "topics": ["Binary Search", "Array"],
  "difficulty": "Hard",
  "status": "solved",
  "problemUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/"
}
```

### PUT `/problems/:id`
Update status, topic tags, or notes on an existing problem.

### DELETE `/problems/:id`
Remove problem from database.

---

## 7. Dashboard & Analytics

### GET `/dashboard`
Aggregated overview including:
* Summary counts (total solved, peak rating, active streak)
* Connected platform stats
* 7-day practice activity distribution
* Difficulty distribution (Easy, Medium, Hard)

### GET `/analytics`
In-depth breakdown of topic-wise mastery, problem completion percentages, and platform distributions.

---

## 8. Leaderboard & Community

### GET `/leaderboard`
Public or authenticated global developer rankings sorted by total problems solved and peak contest ratings.

---

## 9. Settings & Profile

### PUT `/settings`
Update user preferences:
```json
{
  "dailyGoal": 5,
  "theme": "dark"
}
```

### PUT `/profile`
Update user display name, bio, and GitHub handle.

---

## 10. Standard Error Response

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```
