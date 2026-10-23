import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("codetrack_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem("codetrack_token");
      localStorage.removeItem("codetrack_user");
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const dashboardApi = {
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};

export const problemApi = {
  getProblems: async (params = {}) => {
    const response = await api.get("/problems", { params });
    return response.data;
  },
  createProblem: async (problemData) => {
    const response = await api.post("/problems", problemData);
    return response.data;
  },
  getProblemById: async (id) => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  },
  updateProblem: async (id, updates) => {
    const response = await api.put(`/problems/${id}`, updates);
    return response.data;
  },
  deleteProblem: async (id) => {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  },
};

export const platformApi = {
  getPlatforms: async () => {
    const response = await api.get("/platforms");
    return response.data;
  },
  addPlatform: async ({ platform, username, profileUrl }) => {
    const response = await api.post("/platforms", {
      platform,
      username,
      profileUrl,
    });
    return response.data;
  },
  deletePlatform: async (idOrPlatform) => {
    const response = await api.delete(`/platforms/${idOrPlatform}`);
    return response.data;
  },
  syncPlatforms: async () => {
    const response = await api.post("/platforms/sync");
    return response.data;
  },
  syncPlatform: async (platform) => {
    const response = await api.post(`/platforms/${platform}/sync`);
    return response.data;
  },
};

export const leaderboardApi = {
  getLeaderboard: async (params = {}) => {
    const response = await api.get("/leaderboard", { params });
    return response.data;
  },
};

export const analyticsApi = {
  getAnalytics: async () => {
    const response = await api.get("/analytics");
    return response.data;
  },
};

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },
  updateProfile: async (updates) => {
    const response = await api.put("/profile", updates);
    return response.data;
  },
};

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data;
  },
  updateSettings: async (settings) => {
    const response = await api.put("/settings", settings);
    return response.data;
  },
};

export const sheetApi = {
  getSheets: async () => {
    const response = await api.get("/sheets");
    return response.data;
  },
  getSheetById: async (id, params) => {
    const response = await api.get(`/sheets/${id}`, { params });
    return response.data;
  },
  trackProblem: async (payload) => {
    const response = await api.post("/sheets/track", payload);
    return response.data;
  },
  importAll: async () => {
    const response = await api.post("/sheets/import-all");
    return response.data;
  },
};

export default api;
