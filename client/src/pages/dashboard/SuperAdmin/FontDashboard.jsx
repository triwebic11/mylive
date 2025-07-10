import React, { useEffect, useState } from "react";
import useUserById from "../../../Hooks/useUserById";
import { banner1, banner2 } from "../../../assets";
import ReferralLevelBadge from "../../../components/ReferralLevelBadge";
import useAuth from "../../../Hooks/useAuth";

import { FaArrowRight } from "react-icons/fa"; // 
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-md flex justify-between items-center p-4 min-h-[100px] relative">
    {/* Left: Icon + Title */}
    <div className=" items-center ">
      <span className="text-sm text-purple-800 font-semibold">{title}</span>
      <div className="w-10 h-10 border border-purple-600 flex items-center justify-center rounded-md">
        <FaArrowRight className="text-purple-700 text-sm" />
      </div>
    </div>

    {/* Right: Value */}
    <div>
      <span className="text-xl font-bold text-purple-700">{value}</span>
    </div>

    {/* Bottom Border Highlight */}
    <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-yellow-500 rounded-b-xl" />
  </div>
);



const TopSlider = () => {
  const images = [banner1, banner2];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white shadow rounded-2xl mb-6">
      <div className="flex justify-center items-center p-4">
        <img
          src={images[currentIndex]}
          alt={`Slider ${currentIndex + 1}`}
          className="w-[500px] h-32 object-contain mx-auto transition-all duration-500"
        />
      </div>
    </div>
  );
};

const FontDashboard = () => {
  const [data] = useUserById();
  const { user } = useAuth();
  const userId = user?.user?._id || "";
  const fundStats = [
    { title: "Car Fund", value: 0 },
    { title: "Special Fund", value: 0 },
    { title: "Tour Fund", value: 0 },
    { title: "Home Fund", value: 0 },
  ];
  const [duration, setDuration] = useState("15s");


  const axiosPublic = useAxiosPublic()

  console.log(data)

  const { data: agregate, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['agregate', data?._id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/userAgregateData/${data?._id}`);
      return res.data;
    },
  });
  // console.log('agretateee',agregate)



  const {
    data: orders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/cashonDelivery/all`);
        return Array.isArray(res.data) ? [...res.data].reverse() : [];
      } catch (err) {
        console.error("Error fetching cash on delivery:", err);
        throw err;
      }
    },
  });
  const userProductsArry = orders?.filter(
    (order) => order?.userId === data?._id
  );
  const shippedProductsArry = userProductsArry?.filter(
    (order) => order?.status === 'shipped'
  );
  const pendingProductsArry = userProductsArry?.filter(
    (order) => order?.status === 'pending'
  );

  // console.log(userProductsArry)

  return (
    <div className=" w-[100%] mx-auto  min-h-screen">
      <h2 className="p-2 text-xl font-semibold">Dashboard</h2>
      {/* Notice Marquee */}
      <div className="relative w-full bg-white shadow rounded-2xl mb-6 flex items-center overflow-hidden h-12">
        {/* Label */}
        <div className="px-4 font-bold text-base text-black whitespace-nowrap">
          Notice:
        </div>
        {/* Animated Text */}
        <div className="flex-1 overflow-hidden text-red-500 font-semibold text-sm md:text-base">
          <marquee>প্রতি শনিবার ও রবিবার আপনারা টাকা উইথড্র দিতে পারবেন এবং প্রতি বুধবার টাকা আপনার একাউন্ট এ চলে যাবে । কোন সমস্যা দেখা দিলে অবশ্যই সাপোর্ট এ যোগাযোগ করুন</marquee>
        </div>
      </div>

      <TopSlider />

      <p>Name: {data?.name}</p>
            {/* <p>Role: {data?.role}</p> */}
            <p>Phone: {data?.phone}</p>
            {/* <p>Package: {data?.package}</p> */}

      <header className="mb-6">
        {/* <h1 className="hidden md:inline-flex md:text-center lg:text-center text-2xl font-bold  text-purple-800">
                    Welcome to SHS Lira Enterprise Ltd.
                </h1> */}
        {/* <p className="text-center text-sm text-gray-600">
          Repurchase Validity: 30d 23h 59m 59s
        </p> */}
      </header>

      <ReferralLevelBadge userId={userId} />
      <div className="w-full mx-auto p-2 space-y-4">
        {/* Header Bar */}
        <div className="bg-pink-600 text-white flex justify-between items-center px-4 py-2 rounded-md">
          <h2 className="text-base font-semibold">Repurchase Validity</h2>
          <span className="text-sm font-bold uppercase">Active</span>
        </div>

        {/* Cards Row */}
        <div className="md:flex md:gap-4 space-y-4 md:space-y-0">
          {/* Status Card */}
          <div className="md:w-1/2">
            <div className="bg-white h-28 shadow-black/80 shadow-sm rounded-md p-4 flex justify-between items-center text-center text-sm">
              <div className="flex-1">
                <div className="inline-block bg-green-300 text-green-900 font-semibold px-3 py-1 rounded-full text-xs">
                  Active
                </div>
                <p className="mt-1 text-gray-700">Status</p>
              </div>
              <div className="flex-1 border-l">
                <p className="font-bold text-gray-800">{data?.package}</p>
                <p className="text-gray-700">Package</p>
              </div>
              <div className="flex-1 border-l">
                <p className="font-bold text-gray-800">None</p>
                <p className="text-gray-700">Rank</p>
              </div>
            </div>
          </div>

          {/* Order Card */}
          <div className="md:w-1/2">
            <div className="bg-white shadow-black/80 shadow-sm rounded-md p-2 text-center text-sm h-28  ">
              <h3 className="text-purple-700 font-bold text-base mb-2">Order</h3>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{userProductsArry?.length}</p>
                  <p className="text-gray-700">Total</p>
                </div>
                <div className="flex-1 border-l">
                  <p className="font-bold text-gray-900">{shippedProductsArry?.length}</p>
                  <p className="text-gray-700">Approved</p>
                </div>
                <div className="flex-1 border-l">
                  <p className="font-bold text-gray-900">{pendingProductsArry?.length}</p>
                  <p className="text-gray-700">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {agregate?.summary?.map((stat, idx) => (
          <DashboardCard key={idx} title={stat?.title} value={stat.value} />
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 text-purple-700">Fund</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {fundStats.map((stat, idx) => (
          <DashboardCard key={idx} title={stat.title} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

export default FontDashboard;
