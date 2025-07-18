/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const CreateDspOrder = () => {
  const axiosSecure = useAxiosSecure();
  const [dspPhone, setDspPhone] = useState("");
  const [products, setProducts] = useState([
    { productId: "", productRate: "", quantity: 1 },
  ]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState({
    phone: "",
    productId: "",
    date: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axiosSecure.get("/admin-orders");
    setOrders(res.data);
  };

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", productRate: "", quantity: 1 }]);
  };

  const handleProductChange = (index, field, value) => {
    const updated = products.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate subtotal for each product
    const productsWithSubtotal = products.map((p) => {
      const rate = parseFloat(p.productRate) || 0;
      const qty = parseInt(p.quantity) || 0;
      const subtotal = rate * qty;
      return { ...p, subtotal };
    });

    const grandTotal = productsWithSubtotal.reduce(
      (acc, curr) => acc + curr.subtotal,
      0
    );

    const orderData = {
      dspPhone,
      products: productsWithSubtotal,
      grandTotal,
      date: new Date().toISOString(),
    };

    await axiosSecure.post("/admin-orders", orderData);
    fetchOrders();
    setDspPhone("");
    setProducts([{ productId: "", productRate: "", quantity: 1 }]);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      order.dspPhone.toLowerCase().includes(search.phone.toLowerCase()) &&
      order.products.some((p) =>
        p.productId.toLowerCase().includes(search.productId.toLowerCase())
      ) &&
      (!search.date || order.date.includes(search.date))
    );
  });

  const grandTotal = products.reduce((acc, curr) => {
    const rate = parseFloat(curr.productRate) || 0;
    const qty = parseInt(curr.quantity) || 0;
    return acc + rate * qty;
  }, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">
        Create DSP Order
      </h2>

      {/* Order Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-xl p-6 rounded-2xl border border-orange-400"
      >
        <input
          type="text"
          placeholder="DSP User Phone"
          value={dspPhone}
          onChange={(e) => setDspPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-orange-400"
          required
        />

        {products.map((product, index) => {
          const subtotal =
            (parseFloat(product.productRate) || 0) *
            (parseInt(product.quantity) || 0);

          return (
            <div
              key={index}
              className="grid md:grid-cols-4 gap-3 items-center bg-gray-50 p-3 rounded-lg"
            >
              <input
                type="text"
                placeholder="Product ID"
                value={product.productId}
                onChange={(e) =>
                  handleProductChange(index, "productId", e.target.value)
                }
                className="px-3 py-2 border rounded-lg w-full"
                required
              />

              <input
                type="text"
                placeholder="Product Rate"
                value={product.productRate}
                onChange={(e) =>
                  handleProductChange(index, "productRate", e.target.value)
                }
                className="px-3 py-2 border rounded-lg w-full"
                required
              />

              <input
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                className="px-3 py-2 border rounded-lg w-full"
                required
              />

              <div className="text-green-600 font-semibold">
                Subtotal: ৳{subtotal}
              </div>
            </div>
          );
        })}

        <div className="text-right text-xl font-bold text-blue-800">
          Grand Total: ৳{grandTotal}
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-lg border border-gray-400"
        >
          + Add Product
        </button>

        <button
          type="submit"
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
        >
          Submit Order
        </button>
      </form>

      {/* Search Filter */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Search Orders
        </h3>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="Filter by DSP Phone"
            value={search.phone}
            onChange={(e) => setSearch({ ...search, phone: e.target.value })}
            className="px-3 py-2 border rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Filter by Product ID"
            value={search.productId}
            onChange={(e) =>
              setSearch({ ...search, productId: e.target.value })
            }
            className="px-3 py-2 border rounded-lg w-full"
          />
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
            className="px-3 py-2 border rounded-lg w-full"
          />
        </div>

        {/* Order List */}
        <div className="h-80 overflow-y-scroll bg-gray-100 p-4 rounded-2xl border border-gray-300">
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="mb-4 bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <p>
                    <strong className="text-gray-700">DSP:</strong>{" "}
                    {order.dspPhone}
                  </p>
                  <p>
                    <strong className="text-gray-700">Date:</strong>{" "}
                    {order.date?.slice(0, 10)}
                  </p>
                </div>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {order.products.map((p, i) => (
                    <li key={i}>
                      Product: <strong>{p.productId}</strong> | Qty:{" "}
                      {p.quantity} | Rate: {p.productRate} |
                      <span className="text-green-700 font-semibold">
                        {" "}
                        Subtotal: ৳{p.subtotal}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="text-right mt-2 text-blue-600 font-bold">
                  Grand Total: ৳{order.grandTotal}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CreateDspOrder;
