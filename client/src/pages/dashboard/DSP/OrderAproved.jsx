import React, { useEffect, useRef, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import logo from "../../../assets/logo.jpg";
const OrderAproved = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState({
    productId: "",
    date: "",
  });

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const dspPhone = user?.user?.phone || user?.user?.email || "";
  const pdfRefs = useRef({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (dspPhone) {
      axiosPublic
        .get(`/admin-orders/by-phone/${dspPhone}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [dspPhone]);

  const filteredOrders = orders.filter((order) => {
    return (
      order.products.some((p) =>
        p.productId.toLowerCase().includes(search.productId.toLowerCase()),
      ) &&
      (!search.date || order.date.includes(search.date))
    );
  });

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
      // console.log("PDF Element For ID", orderId, element);
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
      setShow(false);
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
                    onClick={() => {
                      handleDownloadPDF(order._id);
                      setShow(true);
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mb-2"
                  >
                    Download PDF
                  </button>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                    {/* Date and Phone */}
                    <div className="flex flex-wrap justify-between items-center mb-4 bg-blue-50 p-2 rounded-md">
                      <p className="text-sm font-medium text-gray-700">
                        📅 Date:{" "}
                        <span className="font-semibold">
                          {order.date?.slice(0, 10)}
                        </span>
                      </p>
                      <p>Name: {user?.name || user?.user?.name}</p>
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
                              <th className="py-1 px-1 border">Total BV</th>
                              <th className="py-1 px-1 border">
                                SubDiscount ৳
                              </th>
                              <th className="py-1 border">RFP ৳</th>
                              <th className="py-1 border">CFP ৳</th>
                              <th className="py-1 border">Free Amount</th>
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
                                  {p.isRepurchaseFree
                                    ? p.isRepurchaseFreeAmount
                                    : "No"}
                                </td>
                                <td className="py-1 px-1 border">
                                  {p.subtotal >= 5000
                                    ? p.isConsistencyFree
                                      ? p.isConsistencyFreeAmount
                                      : "No"
                                    : "No"}
                                </td>
                                <td className="py-1 px-1 border">
                                  ৳{p.freeSubtotal || 0}
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
                        🎯 Grand BV: {order.grandPoint || "0"}
                      </p>
                      <p className="text-blue-700">
                        🏷️ Grand Discount: {order.grandDiscount || "0"}
                      </p>
                      <p className="text-blue-700">
                        Grand Free Total: ৳{order.freeGrandTotal || "0"}
                      </p>
                    </div>
                  </div>
                  {show && (
                    <div
                      ref={pdfRefs.current[order._id]}
                      className="bg-white p-8 rounded-md shadow-md border border-gray-300 max-w-[800px] mx-auto"
                    >
                      {/* ---------- Header Section ---------- */}
                      <h1 className="text-center text-lg font-bold mb-3 pb-3">
                        Sale Invoice
                      </h1>

                      <table className=" border-collapse w-full">
                        <tbody>
                          <tr>
                            <td rowSpan={3} className="border ">
                              <img
                                src={logo}
                                alt="logo"
                                className="w-24 h-24 object-contain"
                              />
                            </td>
                            <td className="border px-2 py-2 font-bold">
                              Invoice Number:{" "}
                              {order._id.slice(-8).toUpperCase()}
                            </td>
                            <td className="border px-2 py-2 font-bold">
                              Date: {order.date?.slice(0, 10)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-2 mb-3">
                              Delivery Note
                            </td>
                            <td className="border px-2 py-2">
                              Mode/Term of payment
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 py-2 mb-3">
                              Supplier's Ref
                            </td>
                            <td className="border px-2 py-2">
                              Other Reference
                            </td>
                          </tr>
                          <tr>
                            <td rowSpan={3} className="border px-2 py-2">
                              <p className="text-center">
                                {" "}
                                {user?.name || user?.user?.name}
                              </p>
                              <p> {order?.dspPhone} </p>
                            </td>
                            <td rowSpan={3} className="border px-2 py-2">
                              <p className="text-center">
                                {" "}
                                {user?.name || user?.user?.name}
                              </p>
                              <p className="text-center"> {order?.dspPhone} </p>
                            </td>
                            <td className="border px-2 py-2">
                              Date: {order.date?.slice(0, 10)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 pb-4">
                              Dispatch Document No:
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 pb-6">
                              Dispatch Through:
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="overflow-x-auto ">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr style={{ paddingBottom: "3px" }}>
                              <th className="border px-2 py-2">Product</th>
                              <th className="border px-2 py-2">Qty</th>
                              <th className="border px-2 py-2">BV</th>
                              <th className="border px-2 py-2">DP</th>
                              <th className="border px-2 py-2">MRP</th>
                              <th className="border px-2 py-2">Subtotal</th>
                              <th className="border px-2 py-2">Total BV</th>
                              <th className="border px-2 py-2">SubDiscount</th>
                              <th className="border px-2 py-2">RFP</th>
                              <th className="border px-2 py-2">ACFP</th>
                            </tr>
                          </thead>

                          <tbody>
                            {order.products.map((p, i) => (
                              <tr
                                key={i}
                                style={{ paddingBottom: "3px" }}
                                className="text-center"
                              >
                                <td className="border px-2 py-1 font-medium">
                                  {p.productId} - {p.name}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.quantity}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.pointValue}
                                </td>
                                <td className="border px-2 py-1">
                                  ৳{p.productRate}
                                </td>
                                <td className="border px-2 py-1">
                                  ৳{p.mrpRate}
                                </td>
                                <td className="border px-2 py-1">
                                  ৳{p.subtotal || 0}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.subPoint || 0}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.subDiscount || 0}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.isRepurchaseFree
                                    ? p.isRepurchaseFreeAmount
                                    : "No"}
                                </td>
                                <td className="border px-2 py-1">
                                  {p.subtotal >= 5000
                                    ? p.isConsistencyFree
                                      ? p.isConsistencyFreeAmount
                                      : "No"
                                    : "No"}
                                </td>
                              </tr>
                            ))}
                            <>
                              <tr>
                                <td
                                  colSpan="8"
                                  className="border text-right px-2 font-bold pb-3"
                                >
                                  Free Product Value
                                </td>
                                <td
                                  colSpan={2}
                                  className="border px-2 font-bold pb-3"
                                >
                                  {order.freeGrandTotal || "0"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  colSpan="8"
                                  className="border text-right px-2 font-bold pb-3"
                                >
                                  Invoice Discount
                                </td>
                                <td
                                  colSpan={2}
                                  className="border px-2 font-bold pb-3"
                                >
                                  {order.grandDiscount || "0"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  colSpan="8"
                                  className="border text-right px-2 font-bold pb-3"
                                >
                                  Net Payable
                                </td>
                                <td
                                  colSpan={2}
                                  className="border px-2 font-bold pb-3"
                                >
                                  {order.grandTotal || "0"}
                                </td>
                              </tr>

                              <tr>
                                <td
                                  colSpan="8"
                                  className="border text-right px-2 font-bold pb-3"
                                >
                                  Paid
                                </td>
                                <td
                                  colSpan={2}
                                  className="border px-2 font-bold pb-3"
                                >
                                  {order.grandTotal || "0"}
                                </td>
                              </tr>
                            </>

                            <tr>
                              <td
                                colSpan="10"
                                className="border px-2 py-2 font-bold mb-3"
                              >
                                <p>Paid Amount in Word: </p>
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={6}
                                className="border px-1 py-1 mb-3 pb-3"
                              >
                                Declartion{" "}
                                <p>
                                  {" "}
                                  We declare that this invoice shows the actual
                                  price of the goods descriibe and that all
                                  particular are true and correct
                                </p>
                              </td>
                              <td colSpan={4} className="border px-1 mb-3 pb-3">
                                {" "}
                                <p>Company Bank Details </p> <p>Bank Name:</p>{" "}
                                <p>A/C No:</p> <p>Branch Code:</p>{" "}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={5}
                                className="border px-2 pt-10 mb-3 pb-3"
                              >
                                Customer's Signature
                              </td>
                              <td
                                colSpan={5}
                                className="border px-2 pt-10 text-right mb-3 pb-3"
                              >
                                Authorised Signature
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default OrderAproved;
