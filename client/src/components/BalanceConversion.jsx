import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import socket from "./socket"; // ✅ shared socket used
import useUserById from "../Hooks/useUserById";

const BalanceConversion = ({ userId }) => {
  const [point, setPoint] = useState(0);
  const [rate, setRate] = useState(1);
  const [taka, setTaka] = useState(0);
  const axiosSecure = useAxiosSecure();
  const [data] = useUserById()
  const availablepoints = data?.points - data?.totalwithdraw

  // ✅ Fetch user points
  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/users/${userId}`)
        .then((res) => {
          const userPoints = res.data?.points || 0;
          setPoint(userPoints);
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [axiosSecure, userId]);


  // ✅ Fetch conversion rate
  useEffect(() => {
    axiosSecure
      .get("/conversion-rate")
      .then((res) => {
        const currentRate = res.data?.pointToTaka || 1;
        setRate(parseFloat(currentRate).toFixed(2));
      })
      .catch((err) => console.error("Failed to fetch conversion rate:", err));
  }, [axiosSecure]);

  // ✅ Calculate taka
  useEffect(() => {
    setTaka(availablepoints * rate);
  }, [availablepoints, rate]);

  // ✅ Listen to real-time updates
  useEffect(() => {
    socket.on("connect", () => {
      // console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("balance-updated", ({ userId: targetId, newPoints }) => {
      if (targetId === userId) {
        setPoint(newPoints);
        // console.log("🎯 Points updated via socket:", newPoints);
      }
    });

    socket.on("conversionRateChanged", ({ pointToTaka }) => {
      setRate(pointToTaka);
      // console.log("💸 Conversion rate updated:", pointToTaka);
    });

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
          <p className="text-sm text-gray-500">Available BV</p>
          <p className="text-2xl font-bold text-blue-700">
            {Number(availablepoints).toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-yellow-600">
            1 Point = {rate} ৳
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Balance in Taka</p>
          <p className="text-2xl font-bold text-green-700">
            {Number(taka).toFixed(2)} ৳
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceConversion;
