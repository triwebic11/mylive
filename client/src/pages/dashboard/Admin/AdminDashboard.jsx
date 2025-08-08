import React, { useEffect, useState } from "react";

import { banner1, banner2 } from "../../../assets";
import { FaArrowRight } from "react-icons/fa";
import SalesChart from "./Recharts";
import DashboardCalendar from "./DashboardCalender";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const TopSlider = () => {
  const images = [banner1, banner2, banner2, banner1];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleImages = () => {
    const secondIndex = (currentIndex + 1) % images.length;
    return [images[currentIndex], images[secondIndex]];
  };

  return (
    <div className="w-full overflow-hidden bg-white shadow rounded-2xl mb-6">
      <div className="flex justify-center items-center gap-4 p-4">
        {getVisibleImages().map((img, index) => (
          <img
            key={`${img}-${index}-${currentIndex}`}
            src={img}
            alt={`Slider ${currentIndex + index + 1}`}
            className="w-[300px] md:w-[400px] md:h-40 h-32 object-contain transition-all duration-500"
          />
        ))}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, isPositive, gradient }) => {
  return (
    <div
      className={`rounded-xl shadow-md text-white p-4 w-full min-h-32 flex flex-col justify-between ${gradient}`}
    >
      {/* Title */}
      <div className="text-sm font-semibold">{title}</div>

      {/* Value */}
      <div className="text-2xl font-bold">{value}</div>

      {/* Percentage Change */}
      <div
        className={`text-sm font-medium ${
          isPositive ? "text-green-200" : "text-red-200"
        }`}
      ></div>
    </div>
  );
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const [adminSummary, setAdminSummary] = useState({
    userCount: 0,
    adminOrdersCount: 0,
    adminCounts: 0,
    dspCount: 0,
    productCount: 0,
    dspOrdersCount: 0,
    rankCount: 0,
  });

  useEffect(() => {
    const fetchAdminSummary = async () => {
      try {
        const res = await axiosSecure.get("/adminsummary");
        setAdminSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch admin summary:", error);
      }
    };
    fetchAdminSummary();
  }, [axiosSecure]);

  const cards = [
    {
      title: "Total Users",
      value: adminSummary?.userCount,

      gradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
      title: "Total Orders",
      value: adminSummary?.adminOrdersCount,

      gradient: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      title: "Total DSP",
      value: adminSummary?.dspCount,

      gradient: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      title: "Total Reward & Ranks",
      value: adminSummary?.rankCount,

      gradient: "bg-gradient-to-r from-green-400 to-teal-500",
    },

    {
      title: "Total Products",
      value: adminSummary?.productCount,

      gradient: "bg-gradient-to-r from-green-400 to-teal-500",
    },
  ];
  return (
    <div>
      <h2 className="p-2 text-xl font-semibold">Admin Dashboard</h2>
      <TopSlider />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      <div className="md:flex justify-between items-center gap-6">
        <SalesChart />
        <DashboardCalendar />
      </div>
    </div>
  );
};

export default AdminDashboard;
