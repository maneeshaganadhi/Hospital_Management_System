import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Ct from "./Ct";

const ProtectedRoute = ({ allowedRoles }) => {
    const { state } = useContext(Ct);

    if (!state.token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(state.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
