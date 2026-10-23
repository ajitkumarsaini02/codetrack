import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Layers,
  Trophy,
  UserRound,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ collapsed = false }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "DSA Sheets", path: "/sheets", icon: Layers },
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Profile", path: "/profile", icon: UserRound },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <div className="sidebar-logo">
        <img src="/logo-icon.png" alt="CodeTrack" />
        {!collapsed && <h2>CodeTrack</h2>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">
        {isAuthenticated && user ? (
          <>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-avatar">
                  {getInitial(user.name || user.username)}
                </div>
                <div className="sidebar-user-details">
                  <p className="sidebar-user-name">
                    {user.name || user.username}
                  </p>
                  <p className="sidebar-user-email">{user.email}</p>
                </div>
              </div>
            )}
            <div className="sidebar-auth-actions">
              <button
                type="button"
                className="sidebar-btn logout"
                onClick={logout}
                title="Log out of CodeTrack"
              >
                <LogOut size={14} />
                {!collapsed && " Log Out"}
              </button>
            </div>
          </>
        ) : (
          <div className="sidebar-auth-actions">
            <Link to="/login" className="sidebar-btn" title="Sign In">
              <LogIn size={14} />
              {!collapsed && " Sign In"}
            </Link>
            {!collapsed && (
              <Link to="/register" className="sidebar-btn">
                <UserPlus size={14} /> Register
              </Link>
            )}
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-badge">CodeTrack</span>
          <span className="sidebar-footer-sub">DSA Tracker</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
