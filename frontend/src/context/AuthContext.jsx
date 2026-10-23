import { createContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("codetrack_token"),
  );
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("codetrack_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("codetrack_token");
    localStorage.removeItem("codetrack_user");
  }, []);

  // Verify token validity and refresh user on initial mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const storedToken = localStorage.getItem("codetrack_token");
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response.success && response.data) {
          setUser(response.data);
          localStorage.setItem("codetrack_user", JSON.stringify(response.data));
        }
      } catch (err) {
        console.warn("Auth token verification failed:", err.message);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    if (response.success && response.data) {
      const { user: userData, token: authToken } = response.data;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem("codetrack_token", authToken);
      localStorage.setItem("codetrack_user", JSON.stringify(userData));
      return userData;
    }
    throw new Error(response.message || "Login failed");
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    if (response.success && response.data) {
      const { user: newUser, token: authToken } = response.data;
      setToken(authToken);
      setUser(newUser);
      localStorage.setItem("codetrack_token", authToken);
      localStorage.setItem("codetrack_user", JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(response.message || "Registration failed");
  };

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updates };
      localStorage.setItem("codetrack_user", JSON.stringify(merged));
      return merged;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
