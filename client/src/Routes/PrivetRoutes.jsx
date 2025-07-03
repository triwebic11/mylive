

import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";

// import Spinner from "../Componants/Spinner/Spinner";



const PrivetRouter = ({children}) => {
    const {user, loading} = useAuth()
    if(loading){
        return <p>Loading...</p>
    }
    if(user){
        return children
    }

    return <Navigate to="/login" ></Navigate>
};

export default PrivetRouter;