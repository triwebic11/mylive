import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const PackageWaitingPage = () => {
  const { user } = useAuth();
  const { setUserPackage } = useAuth(); // Assuming you have a method to set user package
  console.log("User data from useAuth in waiting page: ", user);
  const userId = user?._id;
  console.log("your user id is-", userId);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const checkApproval = async () => {
      try {
        const res = await axiosSecure.get(`/package-requests/${userId}`);
        const status = res?.data?.status;

        console.log("your status is : ", status);
        console.log("User package request data: ", res?.data);
        localStorage.setItem("userPackage", JSON.stringify(res.data));
        setUserPackage(res.data);

        if (status === "approved") {
          // ✅ Redirect user to login if approved
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to check approval status:", err);
      }
    };

    // Check every 3 seconds
    const interval = setInterval(checkApproval, 3000);
    return () => clearInterval(interval);
  }, [navigate, userId, setUserPackage, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">
          Waiting for Admin Approval
        </h2>
        <p className="text-gray-600 mb-6">
          Your package request has been sent to the admin. Once approved, you’ll
          be redirected to the login page automatically.
        </p>
        <div className="flex justify-center items-center space-x-2 animate-pulse text-orange-400">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PackageWaitingPage;
