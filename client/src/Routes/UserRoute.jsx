import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";


const UserRoute = ({children}) => {
    const {role} = useRole()
    const {loading} = useAuth()

    if(loading){
        return <p>Loading...</p>
    }

    if (role === 'user') {
        return children;
    }

    return <Navigate to="/login"  replace></Navigate>
};

export default UserRoute;