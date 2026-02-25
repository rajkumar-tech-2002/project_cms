import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on their role if they try to access unauthorized route
        const redirectPath = user.role === "Admin" ? "/dashboard" : "/counter/dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
