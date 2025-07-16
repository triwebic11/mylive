/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import useProducts from "../Hooks/useProducts";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useUserById from "../Hooks/useUserById";
import useAuth from "../Hooks/useAuth";

const ProductDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [products] = useProducts();
  const [data] = useUserById();
  const axiosPublic = useAxiosPublic();
  const [quantity, setQuantity] = useState(1);

  const product = products?.find((item) => item._id === id);
  const numericPrice = product ? parseFloat(product?.price || 0) : 0;
  const PV = product ? product?.pointValue * quantity : 0;
  const totalPrice = quantity * numericPrice;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const userStatus =
      data?.email === formData?.email ? "registered" : "unRegistered";

    const orderData = {
      ...formData,
      userId: user?.user?._id,
      product,
      quantity,
      productId: product?.productId,
      totalPrice,
      sector: "ProductPurchase",
      userStatus,
      PV,
      paymentMethod: "Cash on Delivery",
      orderTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      status: "pending",
    };

    try {
      const res = await axiosPublic.post("/cashonDelivery/postdata", orderData);

      Swal.fire({
        icon: "success",
        title: "Order Placed",
        text: "Your order has been placed successfully with Cash on Delivery!",
        timer: 2000,
      });

      reset();
      setQuantity(1);
    } catch (err) {
      console.error("Order failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while placing your order.",
      });
    }
  };

  if (!product) {
    return (
      <div className="text-center py-10 text-red-600">Product not found!</div>
    );
  }

  return (
    <div className="max-w-7xl pt-32 mx-auto p-6 md:flex gap-8">
      <div className="md:w-[60%]">
        <img
          src={product?.image}
          alt="Product"
          className="w-full object-contain mb-4"
        />
        <div className="ml-5">
          <p className="text-xl font-semibold">Product Name: {product?.name}</p>
          <p className="text-xl font-semibold">Price: {product?.price}</p>
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{ __html: product?.details }}
          ></p>
        </div>
      </div>

      <div className="bg-white md:w-[40%] shadow-md p-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Cash on Delivery</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border px-3 py-2 rounded"
              defaultValue={data?.name || ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border px-3 py-2 rounded"
              defaultValue={data?.email || ""}
              readOnly
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full border px-3 py-2 rounded"
              defaultValue={data?.phone || ""}
              readOnly
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your address"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">
              Delivery Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              className="w-full border px-3 py-2 rounded"
              placeholder="Any special instructions?"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decreaseQty}
                className="bg-gray-300 px-3 py-1 rounded text-lg"
              >
                −
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                type="button"
                onClick={increaseQty}
                className="bg-gray-300 px-3 py-1 rounded text-lg"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-gray-700 font-semibold">
              Total Price: {totalPrice.toLocaleString()} TK
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Order Now (Cash on Delivery)
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
