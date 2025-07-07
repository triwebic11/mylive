import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useKycStatusById = (userId) => {
  const [status, setStatus] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!userId) return;

    const fetchKycStatus = async () => {
      try {
        const res = await axiosSecure.get(`/kyc/user/${userId}`);
        setStatus(res.data?.status || "not_submitted");
      } catch (err) {
        console.error("❌ Failed to fetch KYC status by ID:", err);
        setStatus("not_submitted");
      }
    };

    fetchKycStatus();
  }, [userId, axiosSecure]);

  return status;
};

export default useKycStatusById;
