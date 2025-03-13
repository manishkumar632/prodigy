import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h2>Welcome to Dashboard</h2>
      <div className="user-info">
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
