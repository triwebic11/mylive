import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const demoResults = [
    {
        phone: "01301650884",
        name: "MD MOSTAFIGUR RAHMAN",
        colour: "red",
    },
    {
        phone: "01770820070",
        name: "MD: MIZANUR RAHMAN",
        colour: "yellow",
    },
    {
        phone: "01988546881",
        name: "TAFURA AKTER",
        colour: "red",
    },
    {
        phone: "01764966810",
        name: "MD AKTARUL ISLAM",
        colour: "red",
    },
    {
        phone: "01300343723",
        name: "MD ABID HASAN",
        colour: "green",
    },
    {
        phone: "01723741813",
        name: "MD. KAISAR AZAM CHOWDHURY",
        colour: "yellow",
    },
    {
        phone: "01715528236",
        name: "Rukaiya Akter Bunna",
        colour: "orange",
    },
];


export default function MyTeam() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(demoResults);
    const [expanded, setExpanded] = useState({});

    const colourMap = {
        red: "text-red-600",
        yellow: "text-yellow-500",
        green: "text-green-600",
    };

    const handleSearch = () => {

        console.log("Searching for", query);
    };

    const toggleCard = (i) =>
        setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 font-sans">
            <div className="mx-auto w-full max-w-6xl">
                {/* Top–right action */}
                <div className="mb-4 flex justify-end">
                    <button className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50">
                        + Create Refer
                    </button>
                </div>

                {/* Search input */}
                <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                        onClick={handleSearch}
                        className="w-fit rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                        Search
                    </button>
                </div>

                {/* Uplink text */}
                <p className="mb-6 text-center text-lg">
                    Uplink : <span className="font-bold">01713784136</span>
                </p>

                {/* Referral list */}
                <div className="space-y-6">
                    {results.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            {/* card body */}
                            <div>
                                <p className={`mb-1 text-base font-semibold ${colourMap[item.colour]}`}>
                                    Phone Number: {item.phone}
                                </p>
                                <p className={`text-base font-semibold ${colourMap[item.colour]}`}>
                                    Name : {item.name}
                                </p>
                            </div>

                            {/* expand icon */}
                            <button
                                onClick={() => toggleCard(idx)}
                                className={`${colourMap[item.colour]} ml-4 mt-1 shrink-0 p-1`}
                            >
                                {expanded[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
