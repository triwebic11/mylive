import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';
import useUserById from './useUserById';

const useUserStatements = () => {

    const axiosPublic = useAxiosPublic()
    const [data] = useUserById()
    // console.log('dataaaaaaaaaaa',data)

    const {
        data: agregate,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["agregate", data?._id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/userAllStatements/${data?._id}`);
            return res.data;
        },

    });

     // console.log("Products data:", agregate);


    return [agregate,
        isLoading,
        isError,
        error,
        refetch]

}

export default useUserStatements;