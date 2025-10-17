import { useNavigate } from "react-router";
import { ContributorDashboard } from "../../modules/contributor-dashboard/contributor-dashboard";
import { ManagerDashboard } from "../../modules/manager-dashboard/manager-dashboard";
import { useEffect } from "react";

export const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!role) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div>
            {role === "manager" && (
                <ManagerDashboard onLogout={() => handleLogout()} />
            )}
            {role === "contributor" && (
                <ContributorDashboard onLogout={() => handleLogout()} />
            )}
        </div>
    );
};
