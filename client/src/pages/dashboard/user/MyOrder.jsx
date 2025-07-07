import React, { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
const MyOrders = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  // const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const userId = user?.user?._id;
  //       if (!userId) return;

  //       const res = await axiosPublic.get(`/cashonDelivery/user/${userId}`);
  //       setOrders(res.data);
  //     } catch (error) {
  //       console.error("Error fetching user orders:", error);
  //     }
  //   };

  //   fetchOrders();
  // }, [user]);

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
  console.log("user id from my order", orders);
  const userProductsArry = orders?.filter(
    (order) => order.userId === user?.user?._id
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (!userProductsArry || userProductsArry.length === 0) {
    return <div>No orders found for this user.</div>;
  }
  console.log("userArry", userProductsArry);

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">
        My Orders- {userProductsArry?.length}
      </h2>
      {orders?.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-3 border-b">Product</th>
                <th className="px-4 py-3 border-b">Image</th>
                <th className="px-4 py-3 border-b">Quantity</th>
                <th className="px-4 py-3 border-b">Total Price</th>
                <th className="px-4 py-3 border-b">Point Value</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Order Time</th>
              </tr>
            </thead>
            <tbody>
              {userProductsArry?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-3 border-b font-medium">
                    {order?.product?.name || "No name"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <img
                      src={order?.product?.image}
                      alt="product"
                      className="w-16 h-16 object-contain"
                    />
                  </td>
                  <td className="px-4 py-3 border-b">{order.quantity}</td>
                  <td className="px-4 py-3 border-b">{order.totalPrice} TK</td>
                  <td className="px-4 py-3 border-b">{order.PV}</td>
                  <td className="px-4 py-3 border-b">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        order.status === "pending"
                          ? "bg-red-500"
                          : order.status === "shipped"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">
                    {moment(order.orderTime).format("DD MMMM YYYY, h:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
