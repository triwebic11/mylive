import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useProducts from "../Hooks/useProducts";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
import { useLocation } from "react-router-dom";

const OrderCreate = ({ title }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const location = useLocation();
  // console.log("Current Location:", location);

  const [products] = useProducts();
  const [allProducts, setAllProducts] = useState([]);
  const [showOffer, setShowOffer] = useState([]);
  const [scndProducts, setScndProducts] = useState([
    {
      productId: "",
      productRate: "",
      mrpRate: "",
      discount: "",
      name: "",
      pointValue: "",
      quantity: 1,
      isConsistencyFree: false,
      isRepurchaseFree: false,
    },
  ]);
  const [dspPhone, setDspPhone] = useState("");
  const [order, setOrder] = useState(null);

  // Filter states
  const [phoneFilter, setPhoneFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const userId = user?._id || user?.user?._id;
  console.log("allllll products", products);
  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/admin-orders/by-user/${userId}`)
        .then((res) => {
          setAllProducts(res.data);
        })
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [userId]);

  const handleProductChange = (index, field, value) => {
    const updated = [...scndProducts];
    updated[index][field] = value;
    setScndProducts(updated);
  };

  const addProductField = () => {
    setScndProducts([
      ...scndProducts,
      {
        productId: "",
        productRate: "",
        mrpRate: "",
        discount: "",
        name: "",
        pointValue: "",
        quantity: 1,
        isConsistencyFree: false,
        isRepurchaseFree: false,
      },
    ]);
  };

  const removeProductField = (index) => {
    setScndProducts(scndProducts.filter((_, i) => i !== index));
  };

  const calculateGrandTotal = () =>
    scndProducts.reduce(
      (acc, p) => acc + (+p.productRate || 0) * (+p.quantity || 0),
      0
    );

  const calculateGrandPoint = () =>
    scndProducts.reduce(
      (acc, p) => acc + (+p.pointValue || 0) * (+p.quantity || 0),
      0
    );

  const calculateGrandDiscount = () =>
    scndProducts.reduce((acc, p) => {
      const mrp = +p.mrpRate || 0;
      const price = +p.productRate || 0;
      const quantity = +p.quantity || 0;
      const discount = (mrp - price) * quantity;
      return acc + discount;
    }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scndProductsWithSubtotal = scndProducts.map((p) => {
      const mrp = +p.mrpRate || 0;
      const price = +p.productRate || 0;
      const quantity = +p.quantity || 0;

      return {
        ...p,
        subtotal: price * quantity,
        subPoint: (+p.pointValue || 0) * quantity,
        subDiscount: (mrp - price) * quantity,
      };
    });

    const orderData = {
      userId: userId,
      dspPhone,
      products: scndProductsWithSubtotal,
      grandTotal: calculateGrandTotal(),
      grandPoint: calculateGrandPoint(),
      grandDiscount: calculateGrandDiscount(), // ✅ new field
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/admin-orders", orderData);

      // console.log(`ordersssss`, orderData);
      if (res.data._id) {
        setOrder(res.data);
        Swal.fire("✅ Success", "Order created!", "success");
      }
    } catch (err) {
      console.error("Order creation failed", err);
      Swal.fire("❌ Error", "Failed to create order", "error");
    }
  };

  // Filtering Logic
  const filteredOrders = allProducts
    .slice()
    .reverse()
    .filter((order) => {
      const matchesPhone = phoneFilter
        ? order.dspPhone?.toLowerCase().includes(phoneFilter.toLowerCase())
        : true;

      const matchesProduct = productFilter
        ? order.products?.some((p) =>
            p.productId?.toLowerCase().includes(productFilter.toLowerCase())
          )
        : true;

      const matchesDate = dateFilter
        ? order.date?.slice(0, 10) === dateFilter
        : true;

      const matchesMonth = monthFilter
        ? new Date(order.date).getMonth() + 1 === Number(monthFilter)
        : true;

      return matchesPhone && matchesProduct && matchesDate && matchesMonth;
    });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={dspPhone}
          onChange={(e) => setDspPhone(e.target.value)}
          placeholder="Enter DSP Phone"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />

        {scndProducts.map((product, index) => {
          const matchedProduct = products?.find(
            (p) => p.productId.toString() === product.productId.toString()
          );

          const subtotal =
            (+product.productRate || 0) * (+product.quantity || 0);

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 space-y-4"
            >
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-800 grid grid-cols-2 md:grid-cols-1">
                  <thead className="bg-gray-100 text-gray-900 font-semibold">
                    <tr className="flex flex-col md:flex-row justify-around ">
                      <th className="px-4 py-2 my-2 md:my-0">Product</th>
                      <th className="px-4 py-2 my-2 md:my-0">DP (৳)</th>
                      <th className="px-4 py-2 my-2 md:my-0">MRP</th>
                      <th className="px-4 py-2 my-2 md:my-0">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white md:border-t flex flex-col md:flex-row">
                      {/* Product Selector */}
                      <td className="px-4 py-2 min-w-[200px]">
                        <input
                          list="product-options"
                          value={product?.productId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            handleProductChange(index, "productId", selectedId);

                            const selected = products.find(
                              (p) => p.productId.toString() === selectedId
                            );

                            if (selected) {
                              handleProductChange(
                                index,
                                "productRate",
                                selected.price
                              );
                              handleProductChange(
                                index,
                                "mrpRate",
                                selected.mrpPrice
                              );
                              handleProductChange(
                                index,
                                "pointValue",
                                selected.pointValue
                              );
                              handleProductChange(index, "name", selected.name);
                              handleProductChange(
                                index,
                                "isConsistencyFree",
                                selected.isConsistencyFree
                              );
                              handleProductChange(
                                index,
                                "isRepurchaseFree",
                                selected.isRepurchaseFree
                              );
                            }
                          }}
                          placeholder="Enter Product ID"
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <datalist id="product-options">
                          {products?.map((p) => (
                            <option key={p._id} value={p.productId}>
                              {p.productId} - {p.name}
                            </option>
                          ))}
                        </datalist>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product?.productRate}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "productRate",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Discount Price"
                          required
                          readOnly
                        />
                      </td>

                      {/* Regular Price */}

                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product?.mrpRate}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "mrpRate",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MRP"
                          required
                          readOnly
                        />
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Qty"
                          required
                        />
                      </td>
                      {/* Repurchase Free Product */}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Info */}
              <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 space-y-1">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-900 font-semibold">
                      <tr>
                        <th className="px-4 py-2">Subtotal</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">BV</th>
                        <th className="px-4 py-2">Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-t">
                        <td className="px-4 py-2 font-bold text-blue-700">
                          ৳{subtotal}
                        </td>
                        <td className="px-4 py-2">
                          {matchedProduct?.name || (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {matchedProduct?.pointValue ?? (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {matchedProduct ? (
                            `৳${
                              (+matchedProduct?.mrpPrice || 0) -
                              (+matchedProduct?.price || 0)
                            }`
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-3 px-3">
                    <table>
                      <thead>
                        <th className="px-4 py-2 my-2 md:my-0">
                          Repurchase Free Product
                        </th>
                        <th className="px-4 py-2 my-2 md:my-0">
                          Consistency Free Product
                        </th>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 text-center">
                            {product.isRepurchaseFree ? "Yes" : "No"}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {product.isConsistencyFree ? "Yes" : "No"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {subtotal >= 5000 && (
                      <div className="font-semibold text-lg">
                        {" "}
                        Advance Consistency:{" "}
                        <span className="font-bold text-green-900 mr-3">
                          Yes
                        </span>{" "}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeProductField(index)}
                  className="mt-3 inline-block bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addProductField}
          className="text-blue-700 font-semibold hover:shadow-gray-700 shadow-lg duration-300 cursor-pointer border border-blue-700 px-2 py-1 rounded-lg"
        >
          + Add More Product
        </button>

        <div className="text-right text-lg font-bold text-gray-800">
          Grand Total: ৳{calculateGrandTotal()}
        </div>
        <div className="text-right text-md font-semibold text-blue-700">
          Grand Point: {calculateGrandPoint()}
        </div>
        <div className="text-right text-md font-semibold text-green-700">
          Grand Discount: ৳{calculateGrandDiscount()}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
        >
          Submit Order
        </button>
      </form>

      {/* ✅ Filter inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        <input
          type="text"
          placeholder="Search by Phone"
          onChange={(e) => setPhoneFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Search by Product ID"
          onChange={(e) => setProductFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="date"
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <select
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Order Summary */}
      <div className="space-y-4 max-h-[450px] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-300">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4"
          >
            {/* Order Info Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong className="text-gray-700">Date:</strong>{" "}
                  {order.date?.slice(0, 10)}
                </p>
                <p>
                  <strong className="text-gray-700">Phone:</strong>{" "}
                  {order?.dspPhone}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-blue-600 font-semibold">
                  Grand Total: ৳{order.grandTotal || "0"}
                </p>
                <p className="text-purple-700 font-semibold">
                  Grand Point: {order.grandPoint || "0"}
                </p>
                <p className="text-green-700 font-semibold">
                  Grand Discount: ৳{order.grandDiscount || "0"}
                </p>
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-gray-100 text-gray-900 font-semibold">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">BV</th>
                    <th className="px-4 py-2">DP</th>
                    <th className="px-4 py-2">MRP</th>
                    <th className="px-4 py-2">Subtotal (৳)</th>
                    <th className="px-4 py-2">SubPoint</th>
                    <th className="px-4 py-2">SubDiscount (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p, i) => (
                    <tr
                      key={i}
                      className={`border-t ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {p.productId} - {p.name}
                      </td>
                      <td className="px-4 py-2">{p.quantity}</td>
                      <td className="px-4 py-2">{p.pointValue}</td>
                      <td className="px-4 py-2">৳{p.productRate}</td>
                      <td className="px-4 py-2">৳{p.mrpRate}</td>
                      <td className="px-4 py-2 text-blue-700 font-semibold">
                        ৳{p.subtotal || 0}
                      </td>
                      <td className="px-4 py-2">{p.subPoint || 0}</td>
                      <td className="px-4 py-2 text-green-700 font-semibold">
                        ৳{p.subDiscount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCreate;
