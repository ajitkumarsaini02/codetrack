import { Outlet, Link } from "react-router-dom";
import Logo from "../components/Logo";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-brand">
        <Logo size={34} />
        <span>CodeTrack</span>
      </Link>

      <main className="auth-content">
        <Outlet />
      </main>

      <p className="auth-footer">
        Track progress. Build consistency. Become better.
      </p>
    </div>
  );
};

export default AuthLayout;
