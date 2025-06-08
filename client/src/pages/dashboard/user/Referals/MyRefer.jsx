import React, { useState } from "react";
// Tailwind import করা আছে ধরে নিচ্ছি

const MyRefer = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sampleData = [
        {
            id: 1,
            date: "05-07-2024 11:07:48am",
            name: "MD: MIZANUR RAHMAN",
            placement: "SAKHAWAT HOSSEN",
            status: "Expired",
        },
        {
            id: 2,
            date: "03-08-2024 11:08:31am",
            name: "TAFURA AKTER",
            placement: "SAKHAWAT HOSSEN",
            status: "Free",
        },
        {
            id: 3,
            date: "08-09-2024 19:09:48pm",
            name: "NEWAZ SHARIF",
            placement: "Kamrul Islam",
            status: "Active",
        },
        {
            id: 4,
            date: "15-09-2024 00:09:26am",
            name: "MD NAZMUL HAQUE",
            placement: "SUMON CHANNDRA DEV SHARMA",
            status: "Free",
        },
        {
            id: 5,
            date: "15-09-2024 22:09:49pm",
            name: "PROSHANTO CHANDRA DEBSHARMA",
            placement: "MD NAZMUL HAQUE",
            status: "Free",
        },
        {
            id: 6,
            date: "23-09-2024 00:09:32am",
            name: "MD.ABDUS SALAM CHOWDWRI",
            placement: "PROSHANTO CHANDRA DEBSHARMA",
            status: "Free",
        },
        {
            id: 6,
            date: "23-09-2024 00:09:32am",
            name: "MD.ABDUS SALAM CHOWDWRI",
            placement: "PROSHANTO CHANDRA DEBSHARMA",
            status: "Free",
        },
        {
            id: 6,
            date: "23-09-2024 00:09:32am",
            name: "MD.ABDUS SALAM CHOWDWRI",
            placement: "PROSHANTO CHANDRA DEBSHARMA",
            status: "Free",
        },
        {
            id: 6,
            date: "23-09-2024 00:09:32am",
            name: "MD.ABDUS SALAM CHOWDWRI",
            placement: "PROSHANTO CHANDRA DEBSHARMA",
            status: "Free",
        },
        {
            id: 7,
            date: "25-09-2024 13:09:47pm",
            name: "SREE CHONCHOL MONDOL VOLA",
            placement: "MD MOSTAFIGUR RAHMAN",
            status: "Free",
        },
        {
            id: 8,
            date: "29-09-2024 01:09:27am",
            name: "MD AKTARUL ISLAM",
            placement: "SAKHAWAT HOSSEN",
            status: "Free",
        },
        {
            id: 9,
            date: "30-09-2024 17:09:21pm",
            name: "MD RUHUL AMIN",
            placement: "SAKHAWAT HOSSEN",
            status: "Free",
        },
        {
            id: 10,
            date: "01-10-2024 22:10:37pm",
            name: "ANUKUL KUMAR SINGH",
            placement: "SAKHAWAT HOSSEN",
            status: "Free",
        },
    ];

    const filteredData = sampleData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.placement.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Refer List</h1>

            {/* Search */}
            <div className="mb-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Placement</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-100 border-b border-gray-200"
                                >
                                    <td className="py-2 px-4">{item.id}</td>
                                    <td className="py-2 px-4">{item.date}</td>
                                    <td className="py-2 px-4">{item.name}</td>
                                    <td className="py-2 px-4">{item.placement}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status.toLowerCase() === "active"
                                                ? "bg-green-100 text-green-800"
                                                : item.status.toLowerCase() === "expired"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 px-4 text-center">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 w-full max-w-4xl">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MyRefer;
