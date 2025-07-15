import React, { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
const DspAllOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await useAxiosSecure.get("/orders/all");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
        📋 All Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b text-left">👤 Name</th>
              <th className="px-4 py-3 border-b text-left">📞 Phone</th>
              <th className="px-4 py-3 border-b text-left">📦 Product</th>
              <th className="px-4 py-3 border-b text-left">🔢 Qty</th>
              <th className="px-4 py-3 border-b text-left">📌 Status</th>
              <th className="px-4 py-3 border-b text-left">⚙️ Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{order.name}</td>
                  <td className="px-4 py-2 border-b">{order.phone}</td>
                  <td className="px-4 py-2 border-b">{order.productId}</td>
                  <td className="px-4 py-2 border-b">{order.quantity}</td>
                  <td className="px-4 py-2 border-b capitalize">
                    {order.status}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DspAllOrders;
