
import useUserById from './useUserById';

const useRole = () => {
    const [data] = useUserById();

   const  role = data?.role
   

   
    return {role}

}

export default useRole;