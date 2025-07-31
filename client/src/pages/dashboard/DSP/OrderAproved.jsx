import React, { useEffect, useRef, useState } from "react";
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
  const pdfRefs = useRef({});

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

  // ✅ Refs only for filtered orders
  // useEffect(() => {
  //   const refs = {};
  //   filteredOrders.forEach((order) => {
  //     refs[order._id] = React.createRef();
  //   });
  //   pdfRefs.current = refs;
  // }, [filteredOrders]);

  const preprocessStyles = () => {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const propsToCheck = [
        "backgroundColor",
        "color",
        "borderColor",
        "boxShadow",
      ];

      propsToCheck.forEach((prop) => {
        if (computedStyle[prop] && computedStyle[prop].includes("oklch")) {
          if (prop === "backgroundColor" || prop === "color") {
            el.style[prop] = prop === "backgroundColor" ? "#ffffff" : "#000000";
          } else {
            el.style[prop] = "transparent";
          }
        }
      });
    });
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = pdfRefs.current[orderId]?.current;
      console.log("PDF Element For ID", orderId, element);
      if (!element) {
        console.error("PDF element not found");
        return;
      }

      preprocessStyles();

      setTimeout(() => {
        const opt = {
          margin: 0.5,
          filename: `Order_${orderId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
      }, 500);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
        Approved Orders
      </h2>

      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold">
          Total Orders: {filteredOrders?.length}
        </h1>
      </div>

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

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-300">
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => {
              if (!pdfRefs.current[order._id]) {
                pdfRefs.current[order._id] = React.createRef();
              }

              return (
                <div key={order._id}>
                  <button
                    onClick={() => handleDownloadPDF(order._id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mb-2"
                  >
                    Download PDF
                  </button>

                  <div
                    ref={pdfRefs.current[order._id]}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
                  >
                    {/* Date and Phone */}
                    <div className="flex flex-wrap justify-between items-center mb-4 bg-blue-50 p-2 rounded-md">
                      <p className="text-sm font-medium text-gray-700">
                        📅 Date:{" "}
                        <span className="font-semibold">
                          {order.date?.slice(0, 10)}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        📞 Phone:{" "}
                        <span className="font-semibold">{order?.dspPhone}</span>
                      </p>
                    </div>

                    {/* Products Table */}
                    <div className="bg-gray-100 p-3 rounded-md mb-3">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        🛒 Product Details:
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-300 rounded-md">
                          <thead className="bg-gray-200 text-gray-700">
                            <tr>
                              <th className="py-1 px-2 border">Product</th>
                              <th className="py-1 px-2 border">Qty</th>
                              <th className="py-1 px-2 border">BV</th>
                              <th className="py-1 px-1 border">DP</th>
                              <th className="py-1 px-1 border">MRP</th>
                              <th className="py-1 px-1 border">Subtotal (৳)</th>
                              <th className="py-1 px-1 border">SubPoint</th>
                              <th className="py-1 px-1 border">SubDiscount</th>
                              <th className="py-1 border">RFP</th>
                              <th className="py-1 border">CFP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((p, i) => (
                              <tr key={i} className="text-center text-gray-800">
                                <td className="py-1 px-2 border font-semibold">
                                  {p.productId}-{p.name}
                                </td>
                                <td className="py-1 px-2 border">
                                  {p.quantity}
                                </td>
                                <td className="py-1 px-2 border">
                                  {p.pointValue}
                                </td>
                                <td className="py-1 px-2 border">
                                  ৳{p.productRate}
                                </td>
                                <td className="py-1 px-2 border">
                                  ৳{p.mrpRate}
                                </td>
                                <td className="py-1 px-1 border">
                                  ৳{p.subtotal || 0}
                                </td>
                                <td className="py-1 px-1 border">
                                  {p.subPoint || 0}
                                </td>
                                <td className="py-1 px-1 border">
                                  {p.subDiscount || 0}
                                </td>
                                <td className="py-1 px-1 border">
                                  {p.isRepurchaseFree ? "Yes" : "No"}
                                </td>
                                <td className="py-1 px-1 border">
                                  {p.isConsistencyFree ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="my-1 text-sm">
                          RFP = Repurchase Free Products <br />
                          CFP = Consistency Free Products
                        </div>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="flex flex-wrap justify-between bg-green-50 p-2 rounded-md text-sm font-medium text-gray-800">
                      <p className="text-blue-700">
                        💰 Grand Total: ৳{order.grandTotal || "0"}
                      </p>
                      <p className="text-blue-700">
                        🎯 Grand Point: {order.grandPoint || "0"}
                      </p>
                      <p className="text-blue-700">
                        🏷️ Grand Discount: {order.grandDiscount || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default OrderAproved;
