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
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ collapsed = false, mobileOpen = false, onCloseMobile }) => {
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

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = () => {
    logout();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`sidebar${collapsed ? " sidebar--collapsed" : ""}${
        mobileOpen ? " sidebar--mobile-open" : ""
      }`}
    >
      <div className="sidebar-logo">
        <div className="sidebar-brand-group">
          <img src="/logo-icon.png" alt="CodeTrack" />
          {(!collapsed || mobileOpen) && <h2>CodeTrack</h2>}
        </div>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onCloseMobile}
          aria-label="Close menu"
          title="Close navigation"
        >
          <X size={20} />
        </button>
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
              title={collapsed && !mobileOpen ? item.name : undefined}
              onClick={handleLinkClick}
            >
              <Icon size={20} />
              {(!collapsed || mobileOpen) && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">
        {isAuthenticated && user ? (
          <>
            {(!collapsed || mobileOpen) && (
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
                onClick={handleLogout}
                title="Log out of CodeTrack"
              >
                <LogOut size={14} />
                {(!collapsed || mobileOpen) && " Log Out"}
              </button>
            </div>
          </>
        ) : (
          <div className="sidebar-auth-actions">
            <Link
              to="/login"
              className="sidebar-btn"
              title="Sign In"
              onClick={handleLinkClick}
            >
              <LogIn size={14} />
              {(!collapsed || mobileOpen) && " Sign In"}
            </Link>
            {(!collapsed || mobileOpen) && (
              <Link
                to="/register"
                className="sidebar-btn"
                onClick={handleLinkClick}
              >
                <UserPlus size={14} /> Register
              </Link>
            )}
          </div>
        )}
      </div>

      {(!collapsed || mobileOpen) && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-badge">CodeTrack</span>
          <span className="sidebar-footer-sub">DSA Tracker</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
