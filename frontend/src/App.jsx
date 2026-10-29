import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import AuthLayout from "./layouts/AuthLayout";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Sheets from "./pages/Sheets";
import Problems from "./pages/Problems";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Root Route: Show Landing for guests; redirect to Dashboard for authenticated users
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="blank-layout loading-state"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading CodeTrack...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />;
};

// Protected Dashboard Route: Redirect to /login if unauthenticated
const ProtectedDashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="panel loading-state"
        style={{ padding: "4rem 2rem", textAlign: "center" }}
      >
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Dashboard />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public Root & Dedicated Landing Routes */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/landing" element={<Landing />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Application routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route path="/sheets" element={<Sheets />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 fallback */}
          <Route element={<BlankLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
