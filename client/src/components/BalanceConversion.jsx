import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// ✅ Use live or local backend URL
const socket = io("http://localhost:5000");

const BalanceConversion = ({ userId }) => {
  const [point, setPoint] = useState(0);
  const [rate, setRate] = useState(1);
  const [taka, setTaka] = useState(0);
  const axiosSecure = useAxiosSecure()

  // ✅ Fetch user points initially
  useEffect(() => {
    if (userId) {
      axiosSecure.get(`/users/${userId}`)
        .then((res) => {
          const userPoints = res.data?.points || 0;
          setPoint(userPoints);
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [axiosSecure, userId]);

 
  useEffect(() => {
    axiosSecure
      .get("/conversion-rate")
      .then((res) => {
        const currentRate = res.data?.pointToTaka || 1;
        setRate(currentRate);
      })
      .catch((err) => console.error("Failed to fetch conversion rate:", err));
  }, [axiosSecure]);

  // ✅ Calculate Taka based on point and rate
  useEffect(() => {
    setTaka(point * rate);
  }, [point, rate]);

  // ✅ Real-time socket listeners
  useEffect(() => {
    // Handle socket connect
    socket.on("connect", () => {
      console.log("🟢 Connected to socket server:", socket.id);
    });

    // Point updated for this user
    socket.on("balance-updated", ({ userId: targetId, newPoints }) => {
      if (targetId === userId) {
        setPoint(newPoints);
        console.log("🎉 Points updated via socket:", newPoints);
      }
    });

    // Conversion rate updated globally
    socket.on("conversionRateChanged", ({ pointToTaka }) => {
      setRate(pointToTaka);
      console.log("💸 Rate updated via socket:", pointToTaka);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("balance-updated");
      socket.off("conversionRateChanged");
    };
  }, [userId]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">💰 Your Balance</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Available Points</p>
          <p className="text-2xl font-bold text-blue-700">{point}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-yellow-600">
            1 Point = {rate} ৳
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Balance in Taka</p>
          <p className="text-2xl font-bold text-green-700">{taka} ৳</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceConversion;
