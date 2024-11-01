import CompDashboard from "./CompDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    navigate("/");
  };

  return <CompDashboard handleLogout={handleLogout} />;
};

export default Dashboard;
