import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useUserData = () => {
  const axiosSecure = useAxiosPublic();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await axiosSecure.get('/users/my-referrals');
      // Axios does not have response.ok or response.json()
      return response.data; // directly return data
    },
  });

  console.log(data);
  return [data, isLoading, isError, error, refetch];
};

export default useUserData;
