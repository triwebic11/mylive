import React, { useState } from "react";

const withdrawData = [
    { amount: 240, receive: 216, method: "Nagad", account: "01713784136", status: "Success", created: "2024-12-16 10:06 PM", approved: "2024-12-17 13:07:10" },
    { amount: 290, receive: 261, method: "Nagad", account: "01713784136", status: "Success", created: "2024-11-19 04:09 AM", approved: "2024-11-20 14:17:46" },
    { amount: 1050, receive: 945, method: "Nagad", account: "01713784136", status: "Success", created: "2024-11-11 11:30 PM", approved: "2024-11-12 15:10:37" },
    { amount: 230, receive: 207, method: "Nagad", account: "01713784136", status: "Success", created: "2024-11-05 03:23 AM", approved: "2024-11-05 13:28:59" },
    { amount: 560, receive: 504, method: "Bkash", account: "01713784136", status: "Success", created: "2024-10-29 01:24 AM", approved: "2024-10-29 14:59:34" },
    { amount: 560, receive: 504, method: "Bkash", account: "01713784136", status: "Success", created: "2024-10-29 01:24 AM", approved: "2024-10-29 14:59:34" },
    { amount: 1150, receive: 1035, method: "Nagad", account: "01713784136", status: "Success", created: "2024-10-01 01:51 AM", approved: "2024-10-01 15:35:38" },
    { amount: 1070, receive: 963, method: "Nagad", account: "01713784136", status: "Success", created: "2024-09-24 12:02 AM", approved: "2024-09-24 12:46:18" },
    { amount: 240, receive: 216, method: "Bkash", account: "01713784136", status: "Success", created: "2024-09-02 11:10 PM", approved: "2024-09-03 14:57:01" },
    { amount: 240, receive: 216, method: "Bkash", account: "01713784136", status: "Success", created: "2024-09-02 11:10 PM", approved: "2024-09-03 14:57:01" },
    { amount: 1700, receive: 1530, method: "Bkash", account: "01713784136", status: "Success", created: "2024-08-30 10:30 PM", approved: "2024-09-03 15:02:58" },
    { amount: 70, receive: 63, method: "Bkash", account: "01713784136", status: "Success", created: "2024-08-13 09:40 PM", approved: "2024-08-20 07:52:56" },
    { amount: 70, receive: 63, method: "Bkash", account: "01713784136", status: "Success", created: "2024-08-13 09:40 PM", approved: "2024-08-20 07:52:56" },
    { amount: 70, receive: 63, method: "Bkash", account: "01713784136", status: "Success", created: "2024-08-13 09:40 PM", approved: "2024-08-20 07:52:56" },
];

export default function WithdrawList() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = withdrawData.slice(indexOfFirstEntry, indexOfLastEntry);

    const totalPages = Math.ceil(withdrawData.length / entriesPerPage);

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Withdraw List</h1>
                <button className="bg-gray-600 text-white text-sm px-4 py-1.5 rounded hover:bg-gray-700">
                    Withdraw Create
                </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="entries" className="text-sm text-gray-700 font-medium">
                        Show
                    </label>
                    <select
                        id="entries"
                        className="border border-[#6c757d] rounded px-2 py-1 text-sm focus:outline-none"
                    >
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span className="text-sm text-gray-700 font-medium">entries</span>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="search" className="text-sm text-gray-700 font-medium">
                        Search:
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-[#6c757d] rounded px-2 py-1 text-sm focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md border-gray-300 shadow-sm">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-left text-sm font-semibold border-b border-gray-300">
                        <tr>
                            <th className="px-3 py-2">S/L</th>
                            <th className="px-3 py-2">Amount</th>
                            <th className="px-3 py-2">Receive Amount</th>
                            <th className="px-3 py-2">Method</th>
                            <th className="px-3 py-2">Account No.</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Created At</th>
                            <th className="px-3 py-2">Approved At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-3 py-2">{indexOfFirstEntry + index + 1}</td>
                                <td className="px-3 py-2">{item.amount.toFixed(2)}</td>
                                <td className="px-3 py-2">{item.receive.toFixed(2)}</td>
                                <td className="px-3 py-2">{item.method}</td>
                                <td className="px-3 py-2">{item.account}</td>
                                <td className="px-3 py-2 text-green-600">{item.status}</td>
                                <td className="px-3 py-2">{item.created}</td>
                                <td className="px-3 py-2">{item.approved}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Footer Section */}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <p>
                    Showing {indexOfFirstEntry + 1} to {indexOfLastEntry} of {withdrawData.length} entries
                </p>
                <div className="space-x-2">
                    <button
                        className={`px-2 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 border-gray-400 hover:bg-gray-100'}`}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </button>
                    <button
                        className={`px-2 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-gray-700 border-gray-400 hover:bg-gray-100'}`}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
