import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";


const AdminRoute = ({children}) => {
    const {role} = useRole()
    const {loading} = useAuth()

    if(loading){
        return <p>Loading...</p>
    }

    if (role === 'admin') {
        return children;
    }

    return <Navigate to="/login"  replace></Navigate>
};

export default AdminRoute;