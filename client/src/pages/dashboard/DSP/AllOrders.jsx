/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Orders = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/cashonDelivery/all`);
        return Array.isArray(res.data) ? [...res.data].reverse() : [];
      } catch (err) {
        console.error("Error fetching cash on delivery:", err);
        throw err;
      }
    },
  });

  const parseCustomDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    return new Date(cleaned);
  };

  useEffect(() => {
    if (!orders) return;
    let filtered = orders;

    if (searchAddress) {
      filtered = filtered.filter((order) =>
        order?.address?.toLowerCase().includes(searchAddress.toLowerCase())
      );
    }

    if (searchProductId) {
      filtered = filtered.filter((order) =>
        order?.productId
          ?.toString()
          .toLowerCase()
          .includes(searchProductId.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (fromDate || toDate) {
      filtered = filtered.filter((order) => {
        const orderDate = parseCustomDate(order.orderTime);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return (!from || orderDate >= from) && (!to || orderDate <= to);
      });
    }

    setFilteredOrders(filtered);
  }, [searchAddress, searchProductId, fromDate, toDate, status, orders]);

  const handleUpdateStatus = async (id) => {
    Swal.fire({
      title: "Are you sure to shipped?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axiosSecure.patch(`/cashonDelivery/${id}`, {
          status: "shipped",
        });
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Order Updated",
            text: "This order has been shipped successfully",
            timer: 2000,
          });
          refetch();
        }
      }
    });
  };

  return (
    <div className="p-6  w-full m-auto ">
      <h1 className="text-3xl font-bold mb-6 text-center  overflow-x-hidden">Orders</h1>

      <div className="flex flex-wrap  gap-4 mb-6 items-end  top-24  right-0  bg-white z-10">
        <input
          type="text"
          placeholder="Search by Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-48"
        />
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchProductId}
          onChange={(e) => setSearchProductId(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-48"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="">
            <tr className="bg-gray-200 text-gray-700 text-sm text-left">
              <th className="px-4 py-2">Serial Number </th>
              <th className="px-4 py-2">Product Image </th>
              <th className="px-4 py-2">Product Id</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Purchased On</th>
              <th className="px-4 py-2">Buyer Details</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filteredOrders.length > 0 ? filteredOrders : orders)?.map(
              (order, idx) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    <img src={order?.product.image} alt="" className="w-20" />
                  </td>
                  <td className="px-4 py-2">{order?.productId}</td>
                  <td className="px-4 py-2">{order?.totalPrice}</td>
                  <td className="px-4 py-2">{order?.orderTime}</td>
                  <td className="px-4 py-2">
                    <p>{order?.name}</p>
                    <p>{order?.phone}</p>
                  </td>
                  <td className="px-4 py-2">
                    <p>{order?.address}</p>
                  </td>
                  <td
                    className={`px-4 py-2 font-bold text-center ${
                      order?.status === "pending" &&
                      "text-red-500 bg-red-200 rounded-md"
                    } ${order?.status === "shipped" && "text-green-500"}`}
                  >
                    {order?.status}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      View
                    </button>
                    {order?.status === "shipped" ? (
                      <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        Ship
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(order._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Ship
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
