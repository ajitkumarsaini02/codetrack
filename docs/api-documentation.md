# CodeTrack API Documentation

## 1. Overview

CodeTrack is a DSA Progress Tracker that helps users track coding problems, daily practice, study hours, streaks, and coding platform progress.

**Base URL:** `http://localhost:5000/api/v1`

**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Token)

## 2. Health Check

### Check API Status

- **Method:** GET
- **Endpoint:** `/api/v1/health`
- **Authentication:** Not required

Example response:

```json
{
  "status": "success",
  "message": "CodeTrack API is running"
}
```

## 3. Authentication APIs

### Register User

- **Method:** POST
- **Endpoint:** `/api/v1/auth/register`

Request body:

```json
{
  "name": "Alex Developer",
  "email": "alex@example.com",
  "password": "StrongPassword123"
}
```

### Login User

- **Method:** POST
- **Endpoint:** `/api/v1/auth/login`

Request body:

```json
{
  "email": "alex@example.com",
  "password": "StrongPassword123"
}
```

Example response:

```json
{
  "status": "success",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Alex Developer",
    "email": "alex@example.com"
  }
}
```

Protected endpoints should receive this header:

```http
Authorization: Bearer JWT_TOKEN
```

## 4. Problems APIs

Suggested endpoints:

| Method | Endpoint               | Purpose          |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/v1/problems`     | Get problems     |
| GET    | `/api/v1/problems/:id` | Get one problem  |
| POST   | `/api/v1/problems`     | Add a problem    |
| PUT    | `/api/v1/problems/:id` | Update a problem |
| DELETE | `/api/v1/problems/:id` | Delete a problem |

Example problem:

```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "topic": "Arrays",
  "url": "https://leetcode.com/problems/two-sum/",
  "status": "Solved"
}
```

## 5. Dashboard API

- **Method:** GET
- **Suggested endpoint:** `/api/v1/dashboard`
- **Authentication:** Required

Example response:

```json
{
  "problemsSolved": 120,
  "currentStreak": 7,
  "studyHours": 35,
  "platforms": 4,
  "dailyGoal": {
    "completed": 2,
    "target": 3
  }
}
```

## 6. Progress APIs

Suggested endpoints:

| Method | Endpoint                   | Purpose               |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/v1/progress`         | Get user progress     |
| POST   | `/api/v1/progress`         | Record daily progress |
| GET    | `/api/v1/progress/history` | Get progress history  |

## 7. Leaderboard API

- **Method:** GET
- **Suggested endpoint:** `/api/v1/leaderboard`
- **Authentication:** Depends on implementation

Returns ranked users based on the selected scoring rules.

## 8. Error Response Format

```json
{
  "status": "error",
  "message": "An error occurred"
}
```

Common HTTP status codes:

- `200` — Request successful
- `201` — Resource created
- `400` — Invalid request
- `401` — Authentication required or invalid
- `403` — Access forbidden
- `404` — Resource not found
- `500` — Internal server error

## 9. Implementation Note

The endpoints in this document are a proposed API contract. They are not confirmed as implemented until the corresponding Express routes and controllers are created and tested.
