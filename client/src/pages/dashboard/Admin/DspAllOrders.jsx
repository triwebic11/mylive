import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const DspAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    date: "",
    dateType: "month",
  });
  const axiosSecure = useAxiosSecure();

  const fetchOrders = async () => {
    const res = await axiosSecure.get("/dsp/all");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/dsp/${id}`, { status });
    fetchOrders();
  };

  const filteredOrders = orders.filter((order) => {
    const nameMatch = order.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const phoneMatch = order.phone.includes(filters.phone);

    const orderDate = new Date(order.orderDate);
    const orderDateStr = orderDate.toISOString().slice(0, 10); // YYYY-MM-DD
    const orderMonthStr = `${orderDate.getFullYear()}-${String(
      orderDate.getMonth() + 1
    ).padStart(2, "0")}`; // YYYY-MM

    const filterDate = filters.date;
    const type = filters.dateType;

    const dateMatch =
      filterDate === "" ||
      (type === "day" && orderDateStr === filterDate) ||
      (type === "month" && orderMonthStr === filterDate);

    return nameMatch && phoneMatch && dateMatch;
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
        📋 All Orders
      </h2>

      {/* ✅ Filter Section */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="input w-full sm:w-1/4 p-1 border-gray-600 rounded-lg"
        />
        <input
          type="text"
          placeholder="📞 Search by Phone"
          value={filters.phone}
          onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          className="input w-full sm:w-1/4 p-1 border border-gray-600 rounded-lg "
        />
        <select
          className="input w-full sm:w-1/4 p-1 border-gray-300 rounded-lg"
          onChange={(e) => setFilters({ ...filters, dateType: e.target.value })}
          value={filters.dateType}
        >
          <option value="day">📅 Filter by Day</option>
          <option value="month">🗓️ Filter by Month</option>
        </select>
        <input
          type={filters.dateType === "day" ? "date" : "month"}
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="input w-full sm:w-1/4 p-1 border-gray-600 rounded-lg"
        />
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b text-left">Name</th>
              <th className="px-4 py-3 border-b text-left">Phone</th>
              <th className="px-4 py-3 border-b text-left">Product</th>
              <th className="px-4 py-3 border-b text-left">Qty</th>
              <th className="px-4 py-3 border-b text-left">Status</th>
              <th className="px-4 py-3 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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

export default DspAllOrders;
