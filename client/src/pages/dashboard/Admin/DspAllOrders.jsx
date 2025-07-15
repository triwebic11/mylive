import React, { useEffect, useState } from "react";
import axios from "axios";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("/api/orders/all");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">All Orders</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>Product</th><th>Qty</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.productId}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrders;
