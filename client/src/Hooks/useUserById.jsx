import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';
import useAuth from './useAuth';

const useUserById = () => {
    const { user } = useAuth();

    console.log("useUserById user:", user);
    const axiosPublic = useAxiosPublic();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['user', user?.user?._id], // add id to refetch per user
        enabled: !!user?.user?._id,          // only run when user._id is available
        queryFn: async () => {
            const response = await axiosPublic.get(`/users/${user?.user?._id}`);
            return response.data; // ✅ Axios handles JSON parsing
        },
    });

    return [data, isLoading, isError, error, refetch];
};

export default useUserById;
