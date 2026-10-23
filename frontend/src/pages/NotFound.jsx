import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>

      <Link to="/" className="button button-primary">
        <Home size={17} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
