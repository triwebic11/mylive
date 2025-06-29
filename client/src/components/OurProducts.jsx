/* eslint-disable no-unused-vars */
import React from 'react';
import { onion, toxin, halwa, helth, neem, sampoo, protein, vigoproduct } from "../assets";
import { Link } from 'react-router-dom';
import useProducts from '../Hooks/useProducts';
import Container from './Container';

const OurProducts = () => {
    const [products, isLoading, isError, error, refetch] = useProducts();

    return (
        <div className='py-20 '>

            <div className='bg-gray-800 text-white py-20 flex flex-col items-center justify-center space-y-4'>
                <p className='text-4xl font-semibold'>Our Products</p>
                <p className='text-lg'>100% natural raw materials</p>

            </div>
            <div className='grid grid-cols-1  md:grid-cols-2'>
                {
                    products?.map((item => <>
                        <Link to={`/productdetails/${item._id}`} className="relative  h-[330px] group overflow-hidden">
                            {/* Image */}
                            <img
                                src={item?.image}
                                alt=""
                                className="w-full h-full object-cover transform transition duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
                            />

                            {/* Centered Text */}
                            <div className="absolute inset-0 z-10 flex items-center justify-center text-white text-xl font-semibold">
                                <p className='bg-orange-400 py-1 px-4 rounded-md'>Buy</p>
                            </div>

                            {/* Top Border */}
                            <div className="absolute top-6 left-6 w-0 h-0 border-t-4 border-white transition-all duration-500 group-hover:w-[calc(100%-48px)]" />
                            {/* Left Border */}
                            <div className="absolute top-6 left-6 w-0 h-0 border-l-4 border-white transition-all duration-500 group-hover:h-[calc(100%-48px)]" />
                            {/* Bottom Border */}
                            <div className="absolute bottom-6 left-6 w-0 h-0 border-b-4 border-white transition-all duration-500 group-hover:w-[calc(100%-48px)]" />
                            {/* Right Border */}
                            <div className="absolute top-6 right-6 w-0 h-0 border-r-4 border-white transition-all duration-500 group-hover:h-[calc(100%-48px)]" />
                        </Link>

                    </>))
                }


            </div>

        </div>




    );
};

export default OurProducts;