import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
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

  const mainNav = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "DSA Sheets", path: "/sheets", icon: Layers },
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  const secondaryNav = [
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
        <Link to="/dashboard" className="sidebar-brand-group" onClick={handleLinkClick}>
          <Logo size={28} />
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-brand-text">
              <h2>CodeTrack</h2>
              <span className="sidebar-brand-badge">PRO</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onCloseMobile}
          aria-label="Close menu"
          title="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Main Section */}
        {(!collapsed || mobileOpen) && (
          <div className="sidebar-group-label">WORKSPACE</div>
        )}
        <div className="sidebar-group-items">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " active" : ""}`
                }
                title={collapsed && !mobileOpen ? item.name : undefined}
                onClick={handleLinkClick}
              >
                <Icon size={18} className="sidebar-link-icon" />
                {(!collapsed || mobileOpen) && (
                  <span className="sidebar-link-text">{item.name}</span>
                )}
                <span className="sidebar-active-indicator" />
              </NavLink>
            );
          })}
        </div>

        {/* Secondary Section */}
        <div className="sidebar-divider" />
        {(!collapsed || mobileOpen) && (
          <div className="sidebar-group-label">ACCOUNT</div>
        )}
        <div className="sidebar-group-items">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " active" : ""}`
                }
                title={collapsed && !mobileOpen ? item.name : undefined}
                onClick={handleLinkClick}
              >
                <Icon size={18} className="sidebar-link-icon" />
                {(!collapsed || mobileOpen) && (
                  <span className="sidebar-link-text">{item.name}</span>
                )}
                <span className="sidebar-active-indicator" />
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Status / Account Footer */}
      <div className="sidebar-user">
        {isAuthenticated && user ? (
          <div className="sidebar-user-card">
            <div className="sidebar-user-info">
              <div className="sidebar-avatar">
                {getInitial(user.name || user.username)}
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="sidebar-user-details">
                  <p className="sidebar-user-name">
                    {user.name || user.username}
                  </p>
                  <p className="sidebar-user-email">{user.email}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Log out of CodeTrack"
              aria-label="Log out"
            >
              <LogOut size={15} />
              {(!collapsed || mobileOpen) && <span>Log Out</span>}
            </button>
          </div>
        ) : (
          <div className="sidebar-guest-actions">
            <Link
              to="/login"
              className="sidebar-guest-btn primary"
              title="Sign In"
              onClick={handleLinkClick}
            >
              <LogIn size={14} />
              {(!collapsed || mobileOpen) && <span>Sign In</span>}
            </Link>
            {(!collapsed || mobileOpen) && (
              <Link
                to="/register"
                className="sidebar-guest-btn secondary"
                onClick={handleLinkClick}
              >
                <UserPlus size={14} />
                <span>Register</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
