import React, { useEffect, useState } from "react";

const DashboardCard = ({ title, value }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between h-24">
        <h3 className="text-sm text-gray-600 font-semibold">{title}</h3>
        <p className="text-xl font-bold text-purple-700">{value}</p>
    </div>
);

const TopSlider = () => {
    const images = ["/slider1.jpg", "/slider2.jpg", "/slider3.jpg", "/slider4.jpg"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="w-full overflow-hidden bg-white shadow rounded-2xl mb-6">
            <div className="flex justify-center items-center p-4">
                <img src={images[currentIndex]} alt={`Slider ${currentIndex + 1}`} className="h-20 object-contain transition-all duration-500" />
            </div>
        </div>
    );
};

const FontDashboard = () => {
    const stats = [
        { title: "Total Refer", value: 0 },
        { title: "Total Free Team", value: 0 },
        { title: "Total Active Team", value: 0 },
        { title: "Currently Expired", value: 0 },
        { title: "Total Voucher", value: 0 },
        { title: "Previous Month Pv", value: 0 },
        { title: "Current Month Pv", value: 0 },
        { title: "Monthly down sale pv", value: 0 },
        { title: "Total Team Sale Pv", value: 0 },
        { title: "Total Team Member", value: 0 },
        { title: "Current Purchase Amount", value: 0 },
        { title: "Total Purchase Amount", value: 0 },
        { title: "Total Purchase Pv", value: 0 },
        { title: "Refer Commission", value: 0 },
        { title: "Generation Commission", value: 0 },
        { title: "Mega Commission", value: 0 },
        { title: "Repurchase Sponsor Bonus", value: 0 },
        { title: "Special Fund", value: 0 },
        { title: "Withdrawable Balance", value: 0 },
        { title: "Total Withdraw", value: 0 },
        { title: "Repurchase Commission", value: 0 },
        { title: "Total TDS", value: 0 }
    ];

    const fundStats = [
        { title: "Car Fund", value: 0 },
        { title: "Special Fund", value: 0 },
        { title: "Tour Fund", value: 0 },
        { title: "Home Fund", value: 0 }
    ];

    return (
        <div className=" w-[88%] mx-auto p-6 bg-gray-100 min-h-screen">
            <TopSlider />

            <header className="mb-6">
                <h1 className="text-2xl font-bold text-center text-purple-800">
                    Welcome to SHS Lira Products Marketing Ltd.
                </h1>
                <p className="text-center text-sm text-gray-600">Repurchase Validity: 30d 23h 59m 59s</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <DashboardCard key={idx} title={stat.title} value={stat.value} />
                ))}
            </div>

            <h2 className="text-xl font-bold mt-10 mb-4 text-purple-700">Fund</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {fundStats.map((stat, idx) => (
                    <DashboardCard key={idx} title={stat.title} value={stat.value} />
                ))}
            </div>
        </div>
    );
};

export default FontDashboard;
