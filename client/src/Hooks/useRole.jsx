import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';
import useUserById from './useUserById';

const useRole = () => {
    const [data, isLoading, isError, error, refetch] = useUserById();

   const  role = data?.role
   

   
    return {role}

}

export default useRole;