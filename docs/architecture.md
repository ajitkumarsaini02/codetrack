# CodeTrack Architecture

## 1. Project Overview

CodeTrack is a web application for tracking Data Structures and Algorithms (DSA) practice and coding progress across multiple platforms.

## 2. Technology Stack

| Layer            | Technology   |
| ---------------- | ------------ |
| Frontend         | React        |
| Build Tool       | Vite         |
| Routing          | React Router |
| HTTP Client      | Axios        |
| Charts           | Recharts     |
| Icons            | Lucide React |
| Backend          | Node.js      |
| API Framework    | Express.js   |
| Database         | MongoDB      |
| ODM              | Mongoose     |
| Authentication   | JWT          |
| Password Hashing | bcryptjs     |

## 3. High-Level Architecture

```text
                 User
                  |
                  v
        React + Vite Frontend
                  |
          Axios HTTP Requests
                  |
                  v
        Express REST API
                  |
          Authentication
             Middleware
                  |
                  v
          Route Controllers
                  |
                  v
          Service / Models
                  |
                  v
              MongoDB
```

## 4. Frontend Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Problems.jsx
│   │   └── Leaderboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 5. Backend Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── providers/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## 6. Request Flow

1. A user interacts with the React interface.
2. The frontend sends an HTTP request through Axios.
3. Express receives the request and matches the API route.
4. Authentication middleware validates the JWT when required.
5. The controller processes the request.
6. Mongoose reads or writes data in MongoDB.
7. Express returns a JSON response.
8. React updates the interface with the returned data.

## 7. Security

- Hash passwords using bcryptjs.
- Protect private endpoints with JWT authentication.
- Validate and sanitize incoming data.
- Configure CORS for trusted frontend origins.
- Use Helmet for HTTP security headers.
- Apply rate limiting to sensitive endpoints.
- Keep secrets and database credentials in environment variables.
- Never commit `.env` files to Git.

## 8. Development Ports

| Service  | Local URL                             |
| -------- | ------------------------------------- |
| Frontend | `http://localhost:5173`               |
| Backend  | `http://localhost:5000`               |
| MongoDB  | `mongodb://127.0.0.1:27017/codetrack` |

These ports are the intended development configuration; change them if your environment uses different ports.
