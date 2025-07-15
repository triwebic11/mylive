import React, { useState } from "react";
import useAgregate from "../../../Hooks/useAgregate";
import useUserById from "../../../Hooks/useUserById";

const StatementRow = ({ label, value, bold = false }) => (
    <div
        className={
            `${bold ? "font-semibold" : ""} flex items-center py-1 text-sm md:text-base`
        }
    >
        <span className="whitespace-nowrap">{label}</span>
        <span className="flex-1 border-b border-dotted border-gray-400 opacity-60 mx-2"></span>
        <span className="whitespace-nowrap">{value}</span>
    </div>
);

export default function CommissionStatement({
    statementData = {
        name: "SAKHAWAT HOSSEN",
        rank: "None",
        items: [
            { label: "Refer Commission", value: 0 },
            { label: "Generation Commission", value: 0 },
            { label: "Mega Generation", value: 0 },
            { label: "Self Purchase Bonus", value: 0 },
            { label: "Repurchase Sponsor Bonus", value: 0 },
            { label: "Special Fund", value: 0 },
            { label: "Travel Fund", value: 0 },
            { label: "Car Fund", value: 0 },
            { label: "House Fund", value: 0 },
            { label: "Others", value: 0 },
        ],
        totalCommission: 0,
        tds: 0,
        netPayable: 0,
    },
}) {
    const todayStr = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [data] = useUserById()
    const [agregate,
        isLoading,
        isError,
        error,
        refetch] = useAgregate()
        console.log("agreeeee", agregate)

        const total = agregate?.summary.reduce((sum, item) => sum + item.value, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: fetch new data using startDate & endDate
        console.log("Search clicked", { startDate, endDate });
    };

    return (
        <section className="w-full flex justify-center pt-8 pb-16 px-4 md:px-0">
            <div className="w-full max-w-4xl bg-white rounded shadow p-8 space-y-6">
                {/* Date Range Picker */}
                <form
                    onSubmit={handleSearch}
                    className="grid md:grid-cols-2 gap-6 items-end"
                >
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="startDate" className="text-sm font-medium">
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="endDate" className="text-sm font-medium">
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>

                    {/* Search button spans full width on mobile, auto on md+ */}
                    <div className="md:col-span-2 flex md:justify-center">
                        <button
                            type="submit"
                            className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-700 transition"
                        >
                            SEARCH
                        </button>
                    </div>
                </form>

                {/* Statement Heading */}
                <header className="text-center space-y-1">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Commission Statement
                    </h2>
                    {/* Small text “To” kept in screenshot – can remove if not needed */}
                    <span className="text-xs text-gray-500">To</span>
                </header>

                {/* Name & Rank */}
                <div className="flex flex-col md:flex-row md:justify-between text-sm md:text-base">
                    <span>Name: {data?.name}</span>
                </div>

                {/* Statement Table */}
                <div>
                    <h3 className="font-semibold mb-2">Head</h3>

                    {agregate?.summary?.map((row) => (
                        <StatementRow
                            key={row.title}
                            label={row.title}
                            value={row.value}
                        />
                    ))}

                    {/* Divider */}
                    <div className="border-t mt-4"></div>

                    <StatementRow
                        label="Total Commission"
                        value={total}
                        bold
                    />

                    {/* Divider */}
                    <div className="border-t mt-4"></div>
                </div>
            </div>
        </section>
    );
}
