import { useState, useEffect } from "react";
import { Sun, Moon, Bell, ChevronDown, Search, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchVal, setSearchVal] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

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

        {/* Notification bell */}
        <button
          type="button"
          className="icon-button navbar-bell-btn"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="navbar-badge" />
        </button>

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
