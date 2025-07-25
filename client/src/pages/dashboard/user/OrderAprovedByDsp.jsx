import React, { useEffect, useRef, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const OrderAprovedByDsp = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState({
    productId: "",
    date: "",
  });

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const dspPhone = user?.user?.phone || user?.user?.email || "";
  const pdfRef = useRef(); // PDF reference

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

  const handleDownloadPDF = async () => {
    console.log("PDF GENERATION STARTED");

    const html2pdf = (await import("html2pdf.js")).default;
    const element = pdfRef.current;

    if (!element) {
      console.error("PDF element is missing");
      return;
    }

    const opt = {
      margin: 0.5,
      filename: `OrdersByDSP_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
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
        {filteredOrders.length > 0 && (
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        )}
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

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div
          ref={pdfRef}
          className="space-y-4 max-h-[500px] overflow-y-auto bg-white p-4 rounded-xl border border-gray-300"
        >
          {/* Table header for desktop */}
          <div className="hidden md:grid grid-cols-6 bg-gray-100 px-4 py-2 font-semibold text-gray-700 rounded-md text-sm">
            <div>Date</div>
            <div>Phone</div>
            <div>Product ID</div>
            <div>Qty / Rate</div>
            <div>Points</div>
            <div className="text-right">Totals</div>
          </div>

          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="border-b border-gray-200 pb-4 mb-4 md:grid md:grid-cols-6 md:items-start gap-4 bg-white md:px-4"
              >
                {/* Date */}
                <div className="text-sm">
                  <p className="md:hidden text-gray-500 font-semibold">Date</p>
                  <p>{order.date?.slice(0, 10)}</p>
                </div>

                {/* Phone */}
                <div className="text-sm">
                  <p className="md:hidden text-gray-500 font-semibold">Phone</p>
                  <p>{order.dspPhone}</p>
                </div>

                {/* Products */}
                <div className="text-sm col-span-2 space-y-2">
                  {order.products.map((p, i) => (
                    <div key={i}>
                      <p className="font-medium text-gray-700">{p.productId}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {p.quantity} × {p.productRate}৳
                      </p>
                    </div>
                  ))}
                </div>

                {/* Points */}
                <div className="text-sm space-y-2">
                  {order.products.map((p, i) => (
                    <div key={i} className="text-xs">
                      <p>BV: {p.pointValue}</p>
                      <p>SubPoint: {p.subPoint || 0}</p>
                      <p>SubDiscount: {p.subDiscount || 0}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="text-sm text-right">
                  <p className="text-blue-700 font-semibold">
                    ৳ {order.grandTotal || 0}
                  </p>
                  <p className="text-blue-700 font-semibold">
                    Points: {order.grandPoint || 0}
                  </p>
                  <p className="text-blue-700 font-semibold">
                    Discount: {order.grandDiscount || 0}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderAprovedByDsp;
