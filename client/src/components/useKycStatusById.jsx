// src/components/useKycStatusById.js
import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useKycStatusById = (userId) => {
  const [status, setStatus] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!userId) return;
    axiosSecure
      .get(`/kyc/user/${userId}`)
      .then((res) => {
        setStatus(res.data?.status || "not_submitted");
      })
      .catch((err) => {
        console.error("Failed to fetch KYC status", err);
        setStatus("not_submitted");
      });
  }, [userId, axiosSecure]);

  return status;
};

export default useKycStatusById;
