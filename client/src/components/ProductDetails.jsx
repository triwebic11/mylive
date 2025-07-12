/* eslint-disable no-unused-vars */
import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import useProducts from "../Hooks/useProducts";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useUserById from "../Hooks/useUserById";
import { useState } from "react";
import useAuth from "../Hooks/useAuth";
import { useEffect } from "react";

const ProductDetails = () => {
  const { user } = useAuth();
  console.log("User Id from products:", user?.user?._id);
  const { id } = useParams();
  const [products, isLoading, isError, error, refetch] = useProducts();
  const [data] = useUserById();
  const axiosPublic = useAxiosPublic();
  const [userStatus, setuserStatus] = useState("");

  const product = products?.find((item) => item._id === id);

  // console.log("Product Details:", product);

  const [quantity, setQuantity] = React.useState(1);
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Safely extract numeric price
  const numericPrice = parseFloat(product?.price || 0);
  const PV = product?.pointValue * quantity;
  // console.log("Point Value:", PV);

  const totalPrice = quantity * numericPrice;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    if (data?.email !== formData?.email) {
      setuserStatus("unRegisted");
    } else {
      setuserStatus("registered");
    }
    // console.loh(data?.email)

    const datas = {
      ...formData,
      userId: user?.user?._id,
      product,
      quantity,
      totalPrice,
      sector: "ProductPurchase",
      userStatus,
      PV,
      paymentMethod: "Cash on Delivery",
      orderTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      status: "pending",
    };

    try {
      const res = await axiosPublic.post("/cashonDelivery/postdata", datas);
      console.log("Response data from product", res.data);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-7xl pt-32 mx-auto p-6 md:flex gap-8">
      <div className="md:w-[60%]">
        <img
          src={product?.image}
          alt="Product"
          className="w-full object-contain mb-4"
        />
        <p className="text-2xl font-semibold">Product Name: {product?.name}</p>
        <p className="text-2xl font-semibold">Price: {product?.price}</p>
        <p
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: product?.details }}
        ></p>
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

          {/* Quantity and Total Price */}
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

// export default ProductDetails;
/* eslint-disable no-unused-vars */
// import React from "react";
// import { useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
// import axios from "axios";
// import moment from "moment";
// import useProducts from "../Hooks/useProducts";
// import useAxiosPublic from "../Hooks/useAxiosPublic";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [products, isLoading, isError, error, refetch] = useProducts();
//   const axiosPublic = useAxiosPublic()

//   const product = products?.find((item) => item._id === id);

//   console.log("Product Details:", product);

//   const [quantity, setQuantity] = React.useState(1);
//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   // Safely extract numeric price
//   const numericPrice = parseFloat(product?.price || 0);
//   const PV = product?.pointValue * quantity;
//   console.log("Point Value:", PV);

//   const totalPrice = quantity * numericPrice;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (formData) => {
//     const datas = {
//       ...formData,
//       product,
//       quantity,
//       totalPrice,
//       PV,
//       paymentMethod: "Cash on Delivery",
//       orderTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
//       status: "pending",
//     };

//     try {
//       const res = await axiosPublic.post(
//         "/cashonDelivery/cashonDelivery",
//         datas
//       );
//       console.log(res.data);

//       Swal.fire({
//         icon: "success",
//         title: "Order Placed",
//         text: "Your order has been placed successfully with Cash on Delivery!",
//         timer: 2000,
//       });

//       reset();
//       setQuantity(1);
//     } catch (err) {
//       console.error("Order failed:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: "Something went wrong while placing your order.",
//       });
//     }
//   };

//   if (!product) {
//     return (
//       <div className="text-center py-10 text-red-600">Product not found!</div>
//     );
//   }

//   return (
//     <div className="max-w-7xl pt-32 mx-auto p-6 md:flex gap-8">
//       <div className="md:w-[60%]">
//         <img
//           src={product?.image}
//           alt="Product"
//           className="w-full object-contain mb-4"
//         />
//         <p className="text-2xl font-semibold">Price: {product?.price}</p>
//         <p
//           className="text-lg"
//           dangerouslySetInnerHTML={{ __html: product?.details }}
//         ></p>
//       </div>

//       <div className="bg-white md:w-[40%] shadow-md p-6 rounded-md">
//         <h3 className="text-xl font-semibold mb-4">Cash on Delivery</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block font-medium">Full Name</label>
//             <input
//               type="text"
//               {...register("name", { required: "Name is required" })}
//               className="w-full border px-3 py-2 rounded"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>
//           <div>
//             <label className="block font-medium">Email Address</label>
//             <input
//               type="email"
//               {...register("email", { required: "Email is required" })}
//               className="w-full border px-3 py-2 rounded"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block font-medium">Phone Number</label>
//             <input
//               type="text"
//               {...register("phone", { required: "Phone number is required" })}
//               className="w-full border px-3 py-2 rounded"
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm">{errors.phone.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block font-medium">Address</label>
//             <textarea
//               {...register("address", { required: "Address is required" })}
//               className="w-full border px-3 py-2 rounded"
//             ></textarea>
//             {errors.address && (
//               <p className="text-red-500 text-sm">{errors.address.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block font-medium">
//               Delivery Notes (Optional)
//             </label>
//             <textarea
//               {...register("notes")}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Any special instructions?"
//             ></textarea>
//           </div>

//           {/* Quantity and Total Price */}
//           <div>
//             <label className="block font-medium mb-1">Quantity</label>
//             <div className="flex items-center gap-4">
//               <button
//                 type="button"
//                 onClick={decreaseQty}
//                 className="bg-gray-300 px-3 py-1 rounded text-lg"
//               >
//                 −
//               </button>
//               <span className="text-lg font-medium">{quantity}</span>
//               <button
//                 type="button"
//                 onClick={increaseQty}
//                 className="bg-gray-300 px-3 py-1 rounded text-lg"
//               >
//                 +
//               </button>
//             </div>
//             <p className="mt-2 text-gray-700 font-semibold">
//               Total Price: {totalPrice.toLocaleString()} TK
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
//           >
//             Order Now (Cash on Delivery)
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
