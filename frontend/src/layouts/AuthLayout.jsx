import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Link to="/" className="auth-brand">
        <img src="/logo-icon.png" alt="CodeTrack logo" />
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
