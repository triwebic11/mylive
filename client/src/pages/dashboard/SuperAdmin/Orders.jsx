import React, { useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

// const orders = [
//   {
//     id: "#000000028",
//     date: "2017-04-12 10:29:28",
//     billTo: "Supplier Demo",
//     shipTo: "Supplier Demo",
//     subtotal: 45.0,
//     income: 40.5,
//     status: "Pending",
//   },
//   {
//     id: "#000000027",
//     date: "2017-03-31 11:50:22",
//     billTo: "Veronica Costello",
//     shipTo: "Veronica Costello",
//     subtotal: 120.0,
//     income: 108.0,
//     status: "Complete",
//   },
//   {
//     id: "#000000026",
//     date: "2017-03-31 11:35:41",
//     billTo: "Veronica Costello",
//     shipTo: "Veronica Costello",
//     subtotal: 122.0,
//     income: 109.8,
//     status: "Complete",
//   },
//   {
//     id: "#000000025",
//     date: "2017-03-31 11:33:01",
//     billTo: "Veronica Costello",
//     shipTo: "Veronica Costello",
//     subtotal: 20.0,
//     income: 18.0,
//     status: "Complete",
//   },
// ];

const Orders = () => {
    const [searchId, setSearchId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [status, setStatus] = useState("");
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const [disabled, setDisabled] = useState(false)
    const [filteredOrders, setFilteredOrders] = useState([]);



    const { data: Orders, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/cashonDelivery/all`);
                return res.data;
            } catch (err) {
                console.error("Error fetching cash on delivery:", err);
                throw err;
            }
        },
    });

    console.log("orderssssssss-----", Orders)


    const handleUpdateStatus = async (id) => {

        Swal.fire({
            title: "Are you sure to shipped?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then(async(result) => {
            if (result.isConfirmed) {
                const response = await axiosSecure.patch(`/cashonDelivery/${id}`, {
            status: "shipped",
        });
        console.log(response)
        if (response.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Order Updated",
                text: "This order has been shipped successfully",
                timer: 2000,
            });
            refetch()
            setDisabled(true)
        }

            }
        });
        
        
    }

const handleFilter = () => {
    let filtered = Orders;

    // Filter by _id (case-insensitive partial match)
    if (searchId) {
        filtered = filtered.filter(order =>
            order._id.toLowerCase().includes(searchId.toLowerCase())
        );
    }

    // Filter by status
    if (status) {
        filtered = filtered.filter(order => order.status === status);
    }

    // Filter by date range
    if (fromDate || toDate) {
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderTime);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            return (!from || orderDate >= from) && (!to || orderDate <= to);
        });
    }

    setFilteredOrders(filtered);
};


    return (
        <div className="p-6  w-full m-auto ">
            <h1 className="text-3xl font-bold mb-6 text-center">Orders</h1>

            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <input
                    type="text"
                    placeholder="Autoincrement ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md w-48"
                />
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md w-40"
                >
                    <option value="">Status</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                </select>

                <button
                    onClick={handleFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Filter
                </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-sm text-left">
                            <th className="px-4 py-2">Product Image </th>
                            <th className="px-4 py-2">Purchased On</th>
                            <th className="px-4 py-2">Buyer Name</th>
                            <th className="px-4 py-2">Buyer Number</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Orders?.map((order) => (
                            <tr
                                key={order.id}
                                className="border-t border-gray-200 hover:bg-gray-50 text-sm"
                            >
                                <td className="px-4 py-2">{order?.product.image}</td>
                                <td className="px-4 py-2">{order?.orderTime}</td>
                                <td className="px-4 py-2">{order?.name}</td>
                                <td className="px-4 py-2">{order?.phone}</td>
                                <td className="px-4 py-2">{order?.status}</td>

                                <td className="px-4 py-2 flex gap-2">
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                        View
                                    </button>
                                    {
                                        order?.status=== "shipped" ? <button  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                                        Ship
                                    </button> : <button onClick={() => handleUpdateStatus(order._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Ship
                                    </button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
