import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useProducts from "../Hooks/useProducts";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";

const OrderCreate = ({ title }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [products] = useProducts();
  const [allProducts, setAllProducts] = useState([]);
  const [scndProducts, setScndProducts] = useState([
    { productId: "", productRate: "", name: "", pointValue: "", quantity: 1 },
  ]);
  const [dspPhone, setDspPhone] = useState("");
  const [order, setOrder] = useState(null);

  const userId = user?._id || user?.user?._id;
  console.log("Allllll products - ", allProducts);

  useEffect(() => {
    if (userId) {
      axiosSecure
        .get(`/admin-orders/by-user/${userId}`)
        .then((res) => {
          setAllProducts(res.data);
          console.log("get proooooooducts - ", res.data); // ✅ এটা এখন ঠিক জায়গায়
        })
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [userId]);

  console.log("all product get by Id - ", allProducts);
  const handleProductChange = (index, field, value) => {
    const updated = [...scndProducts];
    updated[index][field] = value;
    setScndProducts(updated);
  };

  const addProductField = () => {
    setScndProducts([
      ...scndProducts,
      { productId: "", productRate: "", name: "", pointValue: "", quantity: 1 },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scndProductsWithSubtotal = scndProducts.map((p) => ({
      ...p,
      subtotal: (+p.productRate || 0) * (+p.quantity || 0),
    }));

    const orderData = {
      userId: userId,
      dspPhone,
      products: scndProductsWithSubtotal,
      grandTotal: calculateGrandTotal(),
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/admin-orders", orderData);
      if (res.data._id) {
        setOrder(res.data);
        Swal.fire("✅ Success", "Order created!", "success");
      }
    } catch (err) {
      console.error("Order creation failed", err);
      Swal.fire("❌ Error", "Failed to create order", "error");
    }
  };

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
              className="bg-gray-50 p-4 rounded-lg border space-y-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Product Selector */}
                <div className="md:col-span-2">
                  <input
                    list="product-options"
                    value={product.productId}
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
                          "pointValue",
                          selected.pointValue
                        );
                        handleProductChange(index, "name", selected.name); // ✅ set name
                      }
                    }}
                    placeholder="Select Product"
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <datalist id="product-options">
                    {products?.map((p) => (
                      <option key={p._id} value={p.productId}>
                        {p.productId} - {p.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Rate */}
                <input
                  type="number"
                  value={product.productRate}
                  onChange={(e) =>
                    handleProductChange(index, "productRate", e.target.value)
                  }
                  className="px-3 py-2 border rounded-lg w-full focus:outline-none"
                  placeholder="Rate"
                  required
                />

                {/* Quantity */}
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                  className="px-3 py-2 border rounded-lg w-full focus:outline-none"
                  placeholder="Qty"
                  required
                />

                {/* Summary */}
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">Subtotal: ৳{subtotal}</p>
                  {matchedProduct && (
                    <>
                      <p>Name: {matchedProduct.name}</p>
                      <p>PV: {matchedProduct.pointValue}</p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeProductField(index)}
                    className="text-red-600 text-xs underline mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addProductField}
          className="text-blue-700 font-semibold hover:underline"
        >
          + Add More Product
        </button>

        <div className="text-right text-xl font-bold text-gray-800">
          Grand Total: ৳{calculateGrandTotal()}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
        >
          Submit Order
        </button>
      </form>

      {/* ✅ Order Summary */}
      {allProducts && (
        <div className="space-y-4 max-h-[450px] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-300">
          {allProducts
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
                    <strong className="font-semibold">Phone:</strong>{" "}
                    {order?.dspPhone}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    Grand Total: ৳{order.grandTotal || "0"}
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

export default OrderCreate;
