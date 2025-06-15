import { useState } from "react";

const orders = [
    {
        id: 1,
        date: "02-08-2024 16:08:59:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1965.00",
        totalPv: "871.69",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 2,
        date: "06-09-2024 14:09:51:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1050.00",
        totalPv: "500.00",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 3,
        date: "08-10-2024 14:10:42:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1220.00",
        totalPv: "515.02",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 4,
        date: "07-11-2024 21:11:32:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1525.00",
        totalPv: "545.00",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 5,
        date: "16-12-2024 10:12:16:am",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1220.00",
        totalPv: "515.02",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 6,
        date: "12-02-2025 16:02:34:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1050.00",
        totalPv: "500.00",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
    {
        id: 7,
        date: "24-05-2025 15:05:24:pm",
        name: "SAKHAWAT HOSSEN",
        phone: "01713784136",
        total: "1050.00",
        totalPv: "500.00",
        type: "Sale",
        status: "Approved",
        consistent: "No",
    },
];

export default function OrderList() {
    const [search, setSearch] = useState("");

    const filteredOrders = orders.filter((order) =>
        order.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 bg-white rounded-lg  overflow-x-auto">
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

            <div className="w-full overflow-x-auto">
                <table className="min-w-[800px] w-full border border-[#6c757d] text-sm">
                    <thead className="bg-[#6c757d] text-white">
                        <tr>
                            <th className="border border-[#6c757d] p-2">ID</th>
                            <th className="border border-[#6c757d] p-2">Date</th>
                            <th className="border border-[#6c757d] p-2">Name</th>
                            <th className="border border-[#6c757d] p-2">Phone</th>
                            <th className="border border-[#6c757d] p-2">Total</th>
                            <th className="border border-[#6c757d] p-2">Total Pv</th>
                            <th className="border border-[#6c757d] p-2">Order Make Type</th>
                            <th className="border border-[#6c757d] p-2">Status</th>
                            <th className="border border-[#6c757d] p-2">Consistent</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="even:bg-[#f2f2f2]">
                                <td className="border border-[#6c757d] p-2">{order.id}</td>
                                <td className="border border-[#6c757d] p-2">{order.date}</td>
                                <td className="border border-[#6c757d] p-2">{order.name}</td>
                                <td className="border border-[#6c757d] p-2">{order.phone}</td>
                                <td className="border border-[#6c757d] p-2">{order.total}</td>
                                <td className="border border-[#6c757d] p-2">{order.totalPv}</td>
                                <td className="border border-[#6c757d] p-2">{order.type}</td>
                                <td className="border border-[#6c757d] p-2 text-green-700 font-semibold">{order.status}</td>
                                <td className="border border-[#6c757d] p-2">{order.consistent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                <p className="text-sm text-gray-700">
                    Showing 1 to {filteredOrders.length} of {orders.length} entries
                </p>
                <div className="flex gap-1">
                    <button className="border border-[#6c757d] px-3 py-1 rounded text-sm text-gray-700 bg-white hover:bg-gray-100">
                        Previous
                    </button>
                    <button className="border border-[#6c757d] px-3 py-1 rounded text-sm text-white bg-[#0d6efd] hover:bg-[#0b5ed7]">
                        1
                    </button>
                    <button className="border border-[#6c757d] px-3 py-1 rounded text-sm text-gray-700 bg-white hover:bg-gray-100">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
