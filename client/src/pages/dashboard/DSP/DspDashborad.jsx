import { useEffect, useState } from "react";
import { banner1, banner2 } from "../../../assets";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const DashboardCard = ({ title, value }) => (
  <div className="bg-gradient-to-r from-pink-400 to-blue-500 rounded-xl border border-gray-200 shadow-md flex justify-between items-center p-4 min-h-32 relative">
    {/* Left: Icon + Title */}
    <div className="items-center">
      <span className="text-sm text-white font-semibold">{title}</span>
    </div>

    {/* Right: Value */}
    <div>
      <span className="text-xl font-bold text-white">{value}</span>
    </div>

    {/* Bottom Border Highlight */}
    <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-yellow-300 rounded-b-xl" />
  </div>
);

const TopSlider = () => {
  const images = [banner1, banner2, banner2, banner1];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleImages = () => {
    const secondIndex = (currentIndex + 1) % images.length;
    return [images[currentIndex], images[secondIndex]];
  };

  return (
    <div className="w-full overflow-hidden bg-white shadow rounded-2xl mb-6">
      <div className="flex justify-center items-center gap-4 p-4">
        {getVisibleImages().map((img, index) => (
          <img
            key={`${img}-${index}-${currentIndex}`}
            src={img}
            alt={`Slider ${currentIndex + index + 1}`}
            className="w-[300px] md:w-[400px] md:h-40 h-32 object-contain transition-all duration-500"
          />
        ))}
      </div>
    </div>
  );
};

const DspDashborad = () => {
//   const [data] = useUserById();
  const { user } = useAuth();
  const [dspOrders, setOrders] = useState([]);
  const userId = user?.user?._id || user?._id || "";
  const [allProducts, setAllProducts] = useState([]);

//   const [duration, setDuration] = useState("15s");

//   const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const dspPhone = user?.user?.phone || user?.user?.email || "";

  useEffect(() => {
    if (dspPhone) {
      axiosSecure
        .get(`/admin-orders/by-phone/${dspPhone}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [dspPhone]);

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

//   const {
//     data: agregate,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["agregate", data?._id],
//     queryFn: async () => {
//       const res = await axiosPublic.get(`/users/userAgregateData/${data?._id}`);
//       return res.data;
//     },
//   });
//   console.log("agretateee", agregate);

  useEffect(() => {
    const updateDuration = () => {
      const isLargeScreen = window.innerWidth >= 768;
    //   setDuration(isLargeScreen ? "25s" : "15s");
    };

    updateDuration();
    window.addEventListener("resize", updateDuration);
    return () => window.removeEventListener("resize", updateDuration);
  }, []);

//   const { data: orders } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => {
//       try {
//         const res = await axiosPublic.get(`/admin-orders/by-phone/${dspPhone}`);
//         return Array.isArray(res.data) ? [...res.data].reverse() : [];
//       } catch (err) {
//         console.error("Error fetching cash on delivery:", err);
//         throw err;
//       }
//     },
//   });
  return (
    <div>
      <h2 className="p-2 text-xl font-semibold">Dsp Dashboard</h2>

      <div className="relative w-full overflow-hidden py-2 flex items-center">
        {/* Inline keyframes only once */}
        <style>
          {`
          @keyframes slideNoticeText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
        </style>

        {/* Static Notice Label */}
        <div className="p-2 font-bold text-xl text-black whitespace-nowrap">
          Notice:
        </div>
        <marquee className="flex-1 overflow-hidden font-semibold text-pink-600">
          SHS Lira Enterprise Ltd-এ আপনাকে স্বাগতম। আপনি প্রতি সপ্তাহে শনিবার ও
          রবিবার Withdraw দিতে পারবেন এবং আপনি মঙ্গলবার এ পেমেন্ট পাবেন |
        </marquee>
      </div>
      <TopSlider />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {/* {Array.isArray(agregate?.summary) ? (
                    agregate?.summary?.map((stat, idx) => (
                        <DashboardCard title={"none"} value={"stat.value"} />
                    ))
                ) : (
                    <p className="text-red-600 font-bold">No summary data found.</p>
                )} */}
        <DashboardCard title="My Orders" value={dspOrders.length} />
        <DashboardCard
          title="Order For User"
          value={allProducts?.length || 0}
        />
        <DashboardCard title="Total Points" value={user?.user?.points || 0} />
      </div>
    </div>
  );
};

export default DspDashborad;
