import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import useProducts from "../Hooks/useProducts";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";
const OrderCreate = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [products, isLoading, isError, error] = useProducts();

  const [scndProducts, setScndProducts] = useState([
    { productId: "", productRate: "", name: "", pointValue: "", quantity: 1 },
  ]);
  const [dspPhone, setDspPhone] = useState("");
  const [order, setOrder] = useState(null);

  // ✅ fetch product list

  // ✅ handle form value changes
  const handleProductChange = (index, field, value) => {
    const updated = [...scndProducts];
    updated[index][field] = value;
    setScndProducts(updated);
  };

  // ✅ add new product row
  const addProductField = () => {
    setScndProducts([
      ...scndProducts,
      { productId: "", productRate: "", name: "", pointValue: "", quantity: 1 },
    ]);
  };

  // ✅ remove row
  const removeProductField = (index) => {
    const updated = scndProducts.filter((_, i) => i !== index);
    setScndProducts(updated);
  };

  // ✅ calculate grand total
  const calculateGrandTotal = () => {
    return scndProducts.reduce((acc, p) => {
      const subtotal =
        (parseFloat(p.productRate) || 0) * (parseInt(p.quantity) || 0);
      return acc + subtotal;
    }, 0);
  };

  // ✅ form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const scndProductsWithSubtotal = scndProducts?.map((p) => ({
      ...p,
      subtotal: (parseFloat(p.productRate) || 0) * (parseInt(p.quantity) || 0),
    }));

    const orderData = {
      userId: user?._id || user?.user?._id,
      dspPhone,
      products: scndProductsWithSubtotal,
      grandTotal: calculateGrandTotal(),
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/admin-orders", orderData);
      if (res.data._id) {
        setOrder(res.data);
        Swal.fire("Success", "Order created!", "success");
      }
    } catch (error) {
      console.error("Order creation failed", error);
      Swal.fire("Error", "Failed to create order", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Create DSP Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={dspPhone}
          onChange={(e) => setDspPhone(e.target.value)}
          placeholder="Enter DSP Phone"
          className="w-full px-4 py-2 border rounded"
          required
        />

        {scndProducts?.map((product, index) => {
          const matchedProduct = products?.find(
            (p) => p.productId.toString() === product.productId.toString()
          );

          const subtotal =
            (parseFloat(product.productRate) || 0) *
            (parseInt(product.quantity) || 0);

          return (
            <div
              key={index}
              className="grid md:grid-cols-5 gap-3 items-center bg-gray-100 p-3 rounded-lg"
            >
              {/* Product Selector */}
              <div className="col-span-2">
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
                      handleProductChange(index, "productRate", selected.price);
                      handleProductChange(
                        index,
                        "pointValue",
                        selected.pointValue
                      );
                    }
                  }}
                  placeholder="Select Product"
                  className="w-full border px-3 py-2 rounded"
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
                className="px-2 py-2 border rounded w-full"
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
                className="px-2 py-2 border rounded w-full"
                placeholder="Qty"
                required
              />

              {/* Summary */}
              <div className="text-sm text-gray-700">
                Subtotal: ৳{subtotal}
                {matchedProduct && (
                  <>
                    <div>Name: {matchedProduct.name}</div>
                    <div>PV: {matchedProduct.pointValue}</div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => removeProductField(index)}
                  className="text-red-600 text-xs mt-1 underline"
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
          className="text-blue-600 font-semibold"
        >
          + Add More Product
        </button>

        <div className="font-bold text-lg text-right">
          Grand Total: ৳{calculateGrandTotal()}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Order
        </button>
      </form>

      {/* ✅ Order Summary */}
      {order && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p>DSP: {order.dspPhone}</p>
          <ul className="text-sm list-disc ml-5">
            {order.products?.map((p, i) => (
              <li key={i}>
                Product ID: {p.productId} | Qty: {p.quantity} | Rate: ৳
                {p.productRate} | PV: {p.pointValue} | Subtotal: ৳{p.subtotal}
              </li>
            ))}
          </ul>
          <div className="text-right font-bold mt-2">
            Total: ৳{order.grandTotal}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCreate;
