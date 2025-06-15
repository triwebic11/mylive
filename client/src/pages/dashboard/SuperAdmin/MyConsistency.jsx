
import React from "react";

const months = [
    { name: "Mar 2025", value: 0 },
    { name: "Apr 2025", value: 0 },
    { name: "May 2025", value: 0 },
    { name: "Jun 2025", value: 0 },
];

const MyConsistency = () => {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <h1 className="text-lg font-semibold text-gray-800 mb-2 pl-8">My Consistency</h1>
            <h2 className="text-2xl font-bold text-black mb-6">My Consistency</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {months.map((month, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-sm rounded-lg p-6 text-center border"
                    >
                        <p className="text-3xl font-medium text-gray-900">{month.value}</p>
                        <p className="mt-2 text-gray-600">{month.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyConsistency;
