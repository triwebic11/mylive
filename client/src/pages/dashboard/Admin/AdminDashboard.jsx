import React, { useEffect, useState } from "react";

import { banner1, banner2 } from "../../../assets";
import { FaArrowRight } from "react-icons/fa";
import SalesChart from "./Recharts";
import DashboardCalendar from "./DashboardCalender";


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

const DashboardCard = ({ title, value, change, isPositive, gradient }) => (
    <div
        className={`rounded-xl shadow-md text-white p-4 w-full min-h-32 flex flex-col justify-between ${gradient}`}
    >
        {/* Title */}
        <div className="text-sm font-semibold">{title}</div>

        {/* Value */}
        <div className="text-2xl font-bold">{value}</div>

        {/* Percentage Change */}
        <div className={`text-sm font-medium ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {isPositive ? '↑' : '↓'} {change}
        </div>
    </div>
);

const cards = [
    {
        title: "Amount spend",
        value: "$7.0K",
        change: "+0.13%",
        isPositive: true,
        gradient: "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    {
        title: "Revenue",
        value: "$42.5K",
        change: "-2.86%",
        isPositive: false,
        gradient: "bg-gradient-to-r from-blue-500 to-blue-700"
    },
    {
        title: "ROI",
        value: "508%",
        change: "-3.55%",
        isPositive: false,
        gradient: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
        title: "Orders",
        value: "960",
        change: "-5.60%",
        isPositive: false,
        gradient: "bg-gradient-to-r from-green-400 to-teal-500"
    },
    {
        title: "Cost per order",
        value: "$7.3",
        change: "+6.07%",
        isPositive: true,
        gradient: "bg-gradient-to-r from-pink-400 to-red-400"
    },
    {
        title: "Avg order amount",
        value: "$44",
        change: "+2.91%",
        isPositive: true,
        gradient: "bg-gradient-to-r from-purple-500 to-pink-400"
    },
];


const AdminDashboard = () => {
    return (
        <div>
            <h2 className="p-2 text-xl font-semibold">Admin Dashboard</h2>
            <TopSlider />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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