import React from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { toxin, helth, neem, sampoo, protein, vigoproduct } from "../assets";
import axios from 'axios';
import moment from "moment";

const ProductDetails = () => {
    const { id } = useParams();
    const numericId = parseInt(id);

    const data = [
        {
            _id: 1,
            image: vigoproduct,
            details: "Vigo product helps in improving your health.",
            Price: "2000",
        },
        {
            _id: 2,
            image: toxin,
            details: "Toxin remover cleanses your body naturally.",
            Price: "2000",
        },
        {
            _id: 3,
            image: helth,
            details: "Health supplement for daily energy boost.",
            Price: "2000",
        },
        {
            _id: 4,
            image: neem,
            details: "Neem oil for skin and hair care.",
            Price: "2000",
        },
        {
            _id: 5,
            image: sampoo,
            details: "Herbal shampoo for strong, healthy hair.",
            Price: "2000",
        },
        {
            _id: 6,
            image: protein,
            details: "Protein supplement for muscle building.",
            Price: "2000",
        },
    ];

    const product = data.find((item) => item._id === numericId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async(formData) => {
        console.log("Order placed:", {
            ...formData,
            product,
            paymentMethod: "Cash on Delivery",
        });
        const datas = {
            ...formData,
            product,
            paymentMethod: "Cash on Delivery",
            orderTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
            status: "pending"
        }

        const res = await axios.post("http://localhost:5000/api/cashonDelivery/cashonDelivery", datas);
        
            console.log(res.data);

        Swal.fire({
            icon: "success",
            title: "Order Placed",
            text: "Your order has been placed successfully with Cash on Delivery!",
            timer: 2000,
        });

        reset();
    };

    if (!product) {
        return <div className="text-center py-10 text-red-600">Product not found!</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:flex gap-8">
            <div className='md:w-[60%]'>
                <img src={product?.image} alt="Product" className="w-full object-contain mb-4" />
                <p className='text-2xl font-semibold'>Price {product?.Price}</p>
                <p className="text-lg">{product?.details}</p>
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
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Email Address</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Phone Number</label>
                        <input
                            type="text"
                            {...register("phone", { required: "Phone number is required" })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Address</label>
                        <textarea
                            {...register("address", { required: "Address is required" })}
                            className="w-full border px-3 py-2 rounded"
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Delivery Notes (Optional)</label>
                        <textarea
                            {...register("notes")}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Any special instructions?"
                        ></textarea>
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
