import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
