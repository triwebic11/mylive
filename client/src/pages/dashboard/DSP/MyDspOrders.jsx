import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyDspOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ productId: "", date: "" });

  useEffect(() => {
    const fetch = async () => {
      const res = await useAxiosSecure.get(`/orders/user/${user._id}`);
      setOrders(res.data);
    };
    fetch();
  }, [user]);

  const filteredOrders = orders.filter(
    (o) =>
      o.productId.includes(filters.productId) &&
      (filters.date === "" ||
        new Date(o.orderDate).toISOString().slice(0, 10) === filters.date)
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
        📦 My Orders
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Product ID"
          onChange={(e) =>
            setFilters({ ...filters, productId: e.target.value })
          }
          className="input input-bordered w-full sm:w-1/2"
        />
        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="input input-bordered w-full sm:w-1/2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-3 text-left border-b">📦 Product</th>
              <th className="px-4 py-3 text-left border-b">🔢 Qty</th>
              <th className="px-4 py-3 text-left border-b">📋 Status</th>
              <th className="px-4 py-3 text-left border-b">📅 Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-gray-50 transition duration-200 text-sm"
                >
                  <td className="px-4 py-3 border-b">{o.productId}</td>
                  <td className="px-4 py-3 border-b">{o.quantity}</td>
                  <td className="px-4 py-3 border-b">{o.status}</td>
                  <td className="px-4 py-3 border-b">
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDspOrders;
