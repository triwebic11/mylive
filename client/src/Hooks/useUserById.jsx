import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUserById = () => {
  const axiosPublic = useAxiosPublic();
   const storedid = localStorage.getItem("userId")
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", storedid],
    enabled: !!storedid,
    queryFn: async () => {
      const response = await axiosPublic.get(`/users/${storedid}`);
      return response.data;
    },
  });

 

  // console.log("useUserById dataaaaaaa:", data);

  return [data, isLoading, isError, error, refetch];
};

export default useUserById;
