import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div className="blank-layout">
      <Outlet />
    </div>
  );
};

export default BlankLayout;
