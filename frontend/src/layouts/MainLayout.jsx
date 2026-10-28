import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Automatically close mobile sidebar on navigation
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => {
      document.body.classList.remove("drawer-open");
    };
  }, [mobileOpen]);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((c) => !c);
    }
  };

  return (
    <div
      className={`app-layout${collapsed ? " sidebar-collapsed" : ""}${
        mobileOpen ? " mobile-sidebar-open" : ""
      }`}
    >
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-backdrop${mobileOpen ? " active" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
