import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useUserData = () => {

    const axiosPublic = useAxiosPublic()
    const {data, isLoading, isError, error, refetch} = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const response = await axiosPublic.get('/users/userData');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    })
    return [data, isLoading, isError, error, refetch]

}

export default useUserData;