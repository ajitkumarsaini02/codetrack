import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Search,
  Menu,
  CheckCircle2,
  Target,
  Sparkles,
  Check,
  Trash2,
  BellOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const defaultNotifications = [
  {
    id: 1,
    title: "Daily Goal In Progress",
    message: "You're on track! Solve 2 more problems today to reach your 5-problem streak.",
    time: "2h ago",
    type: "goal",
    read: false,
  },
  {
    id: 2,
    title: "Platform Stats Live",
    message: "LeetCode and Codeforces accounts synced with live ratings.",
    time: "5h ago",
    type: "sync",
    read: false,
  },
  {
    id: 3,
    title: "DSA Sheets Roadmap",
    message: "Phase 1: Programming Foundation is curated and ready for practice.",
    time: "1d ago",
    type: "roadmap",
    read: false,
  },
];

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  const [notifications, setNotifications] = useState(defaultNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "goal":
        return <Target size={16} className="notif-icon-goal" />;
      case "sync":
        return <CheckCircle2 size={16} className="notif-icon-sync" />;
      case "roadmap":
      default:
        return <Sparkles size={16} className="notif-icon-roadmap" />;
    }
  };

  return (
    <header className="top-navbar">
      {/* Left: hamburger */}
      <div className="navbar-left">
        <button
          type="button"
          className="icon-button navbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center: search */}
      <div className="navbar-search-wrap">
        <Search size={16} className="navbar-search-icon" />
        <input
          className="navbar-search-input"
          type="text"
          placeholder={isMobile ? "Search..." : "Search problems, topics, or sheets..."}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <kbd className="navbar-kbd">Ctrl + K</kbd>
      </div>

      {/* Right: actions */}
      <div className="navbar-right">
        {/* Theme toggle */}
        <button
          type="button"
          className="icon-button theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notification bell & dropdown */}
        <div className="navbar-notif-container" ref={notifRef}>
          <button
            type="button"
            className={`icon-button navbar-bell-btn${
              showNotifications ? " active" : ""
            }`}
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="navbar-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notif-dropdown-header">
                <div className="notif-header-title">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="notif-unread-tag">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-read-btn"
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="notif-dropdown-list">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notif-item${!item.read ? " unread" : ""}`}
                      onClick={(e) => handleToggleRead(item.id, e)}
                    >
                      <div className={`notif-icon-pill ${item.type}`}>
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="notif-item-body">
                        <div className="notif-item-top">
                          <strong className="notif-item-title">
                            {item.title}
                          </strong>
                          <span className="notif-item-time">{item.time}</span>
                        </div>
                        <p className="notif-item-message">{item.message}</p>
                      </div>
                      {!item.read && <span className="notif-unread-dot" />}
                    </div>
                  ))
                ) : (
                  <div className="notif-empty-state">
                    <div className="notif-empty-icon">
                      <BellOff size={24} />
                    </div>
                    <h5>All caught up!</h5>
                    <p>No new notifications right now. Keep up the practice!</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="notif-dropdown-footer">
                  <button
                    type="button"
                    className="notif-clear-btn"
                    onClick={handleClearAll}
                  >
                    <Trash2 size={13} /> Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User info */}
        {isAuthenticated && user ? (
          <div className="navbar-user">
            <div className="header-avatar">
              {getInitial(user.name || user.username)}
            </div>
            <span className="navbar-user-name">
              {user.name || user.username}
            </span>
            <ChevronDown size={15} className="navbar-chevron" />
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
