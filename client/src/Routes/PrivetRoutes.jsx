import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }
    if (user) {
        return children;
    }

    return <Navigate to="/login" replace />;
};

export default PrivateRoute;
