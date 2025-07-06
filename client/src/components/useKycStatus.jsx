import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";

const useKycStatus = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchStatus = () => {
      if (user?.user?._id) {
        axiosSecure
          .get(`/kyc/status/${user.user._id}`)
          .then((res) => {
            setKycStatus(res.data.status);
          })
          .catch((err) => {
            console.error("Failed to get KYC status", err);
          });
      }
    };

    fetchStatus(); // initial load

    intervalId = setInterval(fetchStatus, 5000); // every 5 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [user, axiosSecure]);

  return kycStatus;
};

export default useKycStatus;
