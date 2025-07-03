import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";
import Spinner from "../Componants/Spinner/Spinner";
import useAuth from "../Hooks/useAuth";
// import useRole from "../../Hooks/useRole";
// import LoadingSign from "../../Share/LoadingSign/LoadingSign";


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