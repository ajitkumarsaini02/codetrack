# CodeTrack Database Schema

## 1. Overview

CodeTrack uses MongoDB with Mongoose to store user accounts, coding problems, daily practice records, and coding platform profiles.

The following schema is a proposed design for the application.

## 2. Users Collection

Collection: `users`

| Field       | Type     | Description           |
| ----------- | -------- | --------------------- |
| `_id`       | ObjectId | Unique user ID        |
| `name`      | String   | User's display name   |
| `email`     | String   | Unique email address  |
| `password`  | String   | Hashed password       |
| `createdAt` | Date     | Account creation time |
| `updatedAt` | Date     | Last update time      |

Example:

```json
{
  "name": "Alex Developer",
  "email": "alex@example.com",
  "password": "HASHED_PASSWORD"
}
```

The password must contain a secure hash, never the original plain-text password.

## 3. Problems Collection

Collection: `problems`

| Field        | Type     | Description               |
| ------------ | -------- | ------------------------- |
| `_id`        | ObjectId | Unique problem ID         |
| `userId`     | ObjectId | Reference to user         |
| `title`      | String   | Problem title             |
| `platform`   | String   | LeetCode, CodeChef, etc.  |
| `difficulty` | String   | Easy, Medium, Hard        |
| `topic`      | String   | DSA topic                 |
| `url`        | String   | Problem URL               |
| `status`     | String   | Solved, Attempted, Todo   |
| `solvedAt`   | Date     | Solve date, if applicable |
| `createdAt`  | Date     | Record creation time      |

## 4. Daily Progress Collection

Collection: `dailyprogress`

| Field            | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| `_id`            | ObjectId | Unique record ID         |
| `userId`         | ObjectId | Reference to user        |
| `date`           | Date     | Practice date            |
| `problemsSolved` | Number   | Problems solved that day |
| `studyMinutes`   | Number   | Time spent practicing    |
| `goalTarget`     | Number   | Daily problem target     |
| `createdAt`      | Date     | Record creation time     |

A unique compound index on `userId` and `date` can prevent duplicate daily records for the same user.

## 5. Platform Profiles Collection

Collection: `platformprofiles`

| Field            | Type     | Description                   |
| ---------------- | -------- | ----------------------------- |
| `_id`            | ObjectId | Unique profile ID             |
| `userId`         | ObjectId | Reference to user             |
| `platform`       | String   | Platform name                 |
| `username`       | String   | Platform username             |
| `profileUrl`     | String   | Public profile URL            |
| `problemsSolved` | Number   | Last known solved count       |
| `rating`         | Number   | Platform rating, if available |
| `lastSyncedAt`   | Date     | Last successful sync          |

Possible platforms include LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub.

## 6. Relationships

```text
User
 ├── Problems
 ├── DailyProgress
 └── PlatformProfiles
```

Each related document stores `userId` as a reference to the owning user.

## 7. Recommended Indexes

- `users.email` — unique index
- `problems.userId` — index
- `dailyprogress.userId + dailyprogress.date` — unique compound index
- `platformprofiles.userId + platformprofiles.platform` — unique compound index

## 8. Data Integrity and Security

- Validate all fields through Mongoose schemas.
- Use references to associate records with their owners.
- Ensure users can only access their own private records.
- Validate difficulty and status against allowed values.
- Store timestamps consistently.
- Avoid storing access tokens or credentials for external platforms unless securely required.

## 9. Implementation Status

This document describes the proposed database design. Collections and indexes will be created by Mongoose models and database operations when the corresponding backend code is implemented.
