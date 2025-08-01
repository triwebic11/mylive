// hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useFreeOrPaidProducts = (role) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", role],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/product/${role}`);
      return res.data;
    },
    enabled: !!role, // role না থাকলে call হবে না
  });

  return [products, isLoading, isError, error, refetch];
};

export default useFreeOrPaidProducts;
