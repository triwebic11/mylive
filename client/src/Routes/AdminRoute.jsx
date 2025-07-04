import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { role, isLoading: roleLoading } = useRole();
    const { loading: authLoading } = useAuth();

    if (authLoading || roleLoading) {
        return <p>Loading...</p>;
    }

    if (role === 'admin') {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;
