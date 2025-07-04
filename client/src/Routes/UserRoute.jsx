import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";


const UserRoute = ({children}) => {
     const { role, isLoading: roleLoading } = useRole();
    const { loading: authLoading } = useAuth();

    if (authLoading || roleLoading) {
        return <p>Loading...</p>;
    }
    if (role === 'user') {
        return children;
    }

    return <Navigate to="/login"  replace></Navigate>
};

export default UserRoute;