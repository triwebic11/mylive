import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Storage = () => {
  const axiosSecure = useAxiosSecure();
  const [storage, setStorage] = useState(null);
  const totalLimitMB = 500;

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await axiosSecure.get("/db-stats");
        setStorage(response.data);
        console.log("Storage data fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching storage data:", error);
      }
    };

    fetchStorage();
  }, [axiosSecure]);

  if (!storage) return <p className="text-center">Loading...</p>;

  const usedMB = parseFloat(storage.storageSizeMB);
  const freeMB = parseFloat((totalLimitMB - usedMB).toFixed(2));

  const pieData = {
    labels: ["Used", "Free"],
    datasets: [
      {
        data: [usedMB, freeMB],
        backgroundColor: ["#f87171", "#34d399"],
        borderColor: ["#f87171", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        Database Storage Summary
      </h2>

      <div className="grid grid-cols-2 gap-4 text-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Total Limit</p>
          <p className="text-lg font-bold">{totalLimitMB} MB</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Used</p>
          <p className="text-lg font-bold text-red-500">{usedMB} MB</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Free</p>
          <p className="text-lg font-bold text-green-500">{freeMB} MB</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Collections</p>
          <p className="text-lg font-bold">{storage.collections}</p>
        </div>
      </div>

      <div className="max-w-xs mx-auto">
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Storage;
