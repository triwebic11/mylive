import React, { useState } from "react";

import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DspOrder = () => {
  const { user } = useAuth(); // get name, phone from logged-in user
  const axiosSecure = useAxiosSecure();
  // console.log("DSP user - ", user);
  const [form, setForm] = useState({
    name: user?.user?.name || "",
    phone: user?.user?.phone || "",
    productId: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // console.log("DST Form - ", form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = { ...form, dspUser: user?.user?._id };

    try {
      await axiosSecure.post("/dsp", orderData); // ✅ use secure
      Swal.fire({
        icon: "success",
        title: "Your Order Successful",
        showConfirmButton: false,
        timer: 1000,
      });
      setForm({ ...form, productId: "", quantity: 1 });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
        Create New Order
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Name
        </label>
        <input
          name="name"
          value={form.name}
          disabled
          className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Phone
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Product ID
        </label>
        <input
          name="productId"
          onChange={handleChange}
          placeholder="Enter Product ID"
          className="w-full mt-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Quantity
        </label>
        <input
          name="quantity"
          type="number"
          onChange={handleChange}
          value={form.quantity}
          className="w-full mt-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
      >
        Create Order
      </button>
    </form>
  );
};

export default DspOrder;
