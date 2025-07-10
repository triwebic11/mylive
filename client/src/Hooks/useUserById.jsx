import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useUserById = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", user?.user?._id],
    enabled: !!user?.user?._id,
    queryFn: async () => {
      const response = await axiosPublic.get(`/users/${user?.user?._id}`);
      return response.data;
    },
  });

  // console.log("useUserById dataaaaaaa:", data);

  return [data, isLoading, isError, error, refetch];
};

export default useUserById;
