# CodeTrack Database Schema 🗄️

## 1. Overview

CodeTrack utilizes **MongoDB** with **Mongoose** to persist user accounts, custom practice problems, linked coding profiles, and curated DSA sheet progress.

---

## 2. Collections Specification

### 2.1 Users (`users`)

Stores registered developer profiles and application settings.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Auto-generated user ID |
| `name` | String | Required | Full display name |
| `username` | String | Unique, Indexed | Unique profile handle |
| `email` | String | Unique, Indexed | Normalized email address |
| `password` | String | Required | bcrypt hashed password |
| `bio` | String | Optional | Profile bio |
| `github` | String | Optional | Linked GitHub username |
| `settings.dailyGoal` | Number | Default: 2 | Daily problem target |
| `settings.theme` | String | Default: `"dark"` | Preferred theme (`dark` / `light`) |
| `createdAt` | Date | Auto | Account registration timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

---

### 2.2 Problems (`problems`)

Stores user-created practice problems.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Problem record ID |
| `userId` | ObjectId | Ref: `User`, Indexed | Owner reference |
| `title` | String | Required, Indexed | Problem name |
| `platform` | String | Indexed | Platform (`leetcode`, `codeforces`, etc.) |
| `difficulty` | String | Enum | `Easy`, `Medium`, `Hard` |
| `topics` | [String] | Array | Array of DSA topic tags |
| `status` | String | Enum | `todo`, `attempted`, `solved` |
| `problemUrl` | String | Optional | External question link |
| `notes` | String | Optional | Personal solution notes |
| `solvedAt` | Date | Optional | Timestamp when marked solved |
| `createdAt` | Date | Auto | Record creation timestamp |

---

### 2.3 Platforms (`platforms`)

Stores linked third-party coding platform handles and cached statistics.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Platform link ID |
| `userId` | ObjectId | Ref: `User`, Indexed | Owner reference |
| `platform` | String | Indexed | `leetcode`, `codeforces`, `codechef`, `gfg`, `github` |
| `username` | String | Required | External platform handle |
| `totalSolved` | Number | Default: 0 | Total problems solved on platform |
| `easySolved` | Number | Default: 0 | Easy problems solved |
| `mediumSolved`| Number | Default: 0 | Medium problems solved |
| `hardSolved` | Number | Default: 0 | Hard problems solved |
| `rating` | Number | Optional | Current contest rating |
| `maxRating` | Number | Optional | Peak contest rating |
| `globalRank` | Number | Optional | Worldwide leaderboard ranking |
| `countryRank`| Number | Optional | National leaderboard ranking |
| `stars` | Number | Optional | Star ranking (e.g. CodeChef) |
| `streak` | Number | Optional | Current platform streak |
| `syncStatus` | String | Enum | `idle`, `syncing`, `success`, `failed` |
| `syncError` | String | Optional | Error message if sync failed |
| `lastSyncedAt`| Date | Optional | Last successful sync timestamp |

**Indexes:**
* Compound unique index: `{ userId: 1, platform: 1 }` prevents duplicate platforms per user.

---

### 2.4 User Sheet Progress (`usersheetprogresses`)

Stores interactive progress on curated DSA Mastery Sheets (LeetCode 947 & Codeforces 500).

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Progress record ID |
| `userId` | ObjectId | Ref: `User`, Indexed | Owner reference |
| `sheetId` | String | Indexed | Identifier (`leetcode` or `codeforces`) |
| `problemTitle`| String | Required, Indexed | Canonical title of the sheet problem |
| `status` | String | Enum | `solved`, `todo` |
| `solvedAt` | Date | Optional | Time when problem was checked off |

**Indexes:**
* Compound unique index: `{ userId: 1, sheetId: 1, problemTitle: 1 }` ensures fast lookups and atomic status toggles.

---

## 3. Entity Relationship Diagram

```text
               ┌───────────────────────┐
               │         User          │
               │  (_id, email, name)   │
               └───────────┬───────────┘
                           │ 1
                           │
         ┌─────────────────┼─────────────────┐
         │ *               │ *               │ *
         ▼                 ▼                 ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────────┐
│    Problem     │ │    Platform    │ │ UserSheetProgress  │
│ (userId, title)│ │ (userId, handle│ │(userId, problemKey)│
└────────────────┘ └────────────────┘ └────────────────────┘
```
