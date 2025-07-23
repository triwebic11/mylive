import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const OrderAproved = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState({
    productId: "",
    date: "",
  });

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const dspPhone = user?.user?.phone || user?.user?.email || "";

  useEffect(() => {
    if (dspPhone) {
      axiosSecure
        .get(`/admin-orders/by-phone/${dspPhone}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [dspPhone]);

  const filteredOrders = orders.filter((order) => {
    return (
      order.products.some((p) =>
        p.productId.toLowerCase().includes(search.productId.toLowerCase())
      ) &&
      (!search.date || order.date.includes(search.date))
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
        Approved Orders
      </h2>
      <h1 className="font-semibold my-1">
        Total Orders: {filteredOrders?.length}
      </h1>
      {/* Filter Section */}
      <div className="mb-6 grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Filter by Product ID"
          value={search.productId}
          onChange={(e) => setSearch({ ...search, productId: e.target.value })}
          className="px-4 py-2 border rounded-lg w-full"
        />

        <input
          type="date"
          value={search.date}
          onChange={(e) => setSearch({ ...search, date: e.target.value })}
          className="px-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4 max-h-[450px] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-300">
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <p>
                    <strong className="text-gray-700">Date:</strong>{" "}
                    {order.date?.slice(0, 10)}
                  </p>
                  <p>
                    <strong className="font-semibold">Phone: </strong>{" "}
                    {order?.dspPhone}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    Grand Total: ৳{order.grandTotal || "0"}
                  </p>
                   <p className="text-blue-600 font-semibold">
                    Grand Point: ৳{order.grandPoint || "0"}
                  </p>
                </div>

                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {order.products.map((p, i) => (
                    <li key={i}>
                      Product:{" "}
                      <strong>
                        {p.productId}-{p.name}
                      </strong>{" "}
                      | Qty: {p.quantity} | BV : {p.pointValue} | Rate:{" "}
                      {p.productRate} |{" "}
                      <span className="text-green-700 font-semibold">
                        Subtotal: ৳{p.subtotal || 0}
                      </span>
                      <span className="text-green-700 font-semibold">
                        SubPoint: ৳{p.subPoint || 0}
                      </span>
                    
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderAproved;
