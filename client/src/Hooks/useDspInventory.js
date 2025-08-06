// 📁 hooks/useDspInventory.js

import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "./useAxiosSecure";

const useDspInventory = (phone) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["dspInventory", phone],
    queryFn: async () => {
      const res = await axiosSecure.get(`/inventory/${phone}`);
      return res.data;
    },
  });
};

export default useDspInventory;
