import { useNavigate } from "react-router";
import { ContributorDashboard } from "../../modules/contributor-dashboard/contributor-dashboard";
import { ManagerDashboard } from "../../modules/manager-dashboard/manager-dashboard";

export const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    if (role !== "manager" && role !== "contributor") navigate("/");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div>
            {role === "manager" ? (
                <ManagerDashboard onLogout={() => handleLogout()} />
            ) : (
                <ContributorDashboard onLogout={() => handleLogout()} />
            )}
        </div>
    );
};
