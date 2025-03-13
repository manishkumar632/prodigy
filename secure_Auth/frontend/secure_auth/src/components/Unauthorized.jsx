import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <Link to="/dashboard" className="back-link">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
