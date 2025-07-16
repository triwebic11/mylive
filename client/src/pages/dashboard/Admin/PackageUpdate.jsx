/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { GoPackage } from "react-icons/go";

import DashboardHeadings from "../../../components/DashboardHeadings";
import usePackages from "../../../Hooks/usePackages";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole";

export default function PackageUpdate() {
  const { user } = useAuth();
  console.log("User Id from package update page = ", user?._id);
  const userId = user?.user?._id;
  const userName = user?.user?.name;
  const userEmail = user?.user?.email;
  const userPhone = user?.user?.phone;
  const { role } = useRole();
  console.log("User Role from package update page = ", role);

  console.log("User Info from package update page = ", user);
  const { setUserPackage } = useAuth();
  const navigate = useNavigate();
  const [packages, isLoading, isError, error, refetch] = usePackages();
  console.log(packages);
  const axiosSecure = useAxiosSecure();

  // console.log("user package compo----", data);
  useEffect(() => {
    if (role === "dsp") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "You are a DSP user. You can't purchase a package.",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [role, navigate]);

  const handleAddPackage = async (plan) => {
    const userData = {
      userId: userId,
      name: userName,
      email: userEmail,
      phone: userPhone,
      packageName: plan?.name,
      packagePrice: plan?.price,
      MegaGenerationLevel: plan?.MegaGenerationLevel,
      GenerationLevel: plan?.GenerationLevel,
      PackagePV: plan?.PV,
    };

    try {
      const res = await axiosSecure.post("/package-requests", userData);
      Swal.fire("Success", "Request sent to admin.", "success");
      localStorage.setItem("userPackage", JSON.stringify(userData));
      setUserPackage(userData);
      // ✅ Request success হলে wait page এ পাঠান
      navigate("/package-waiting");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto  py-24 px-4 text-center">
      {/* Header */}
      <DashboardHeadings
        heading={"Our Packages"}
        smalltext={
          "Choose the best package that suits your needs and start earning today!"
        }
      ></DashboardHeadings>
      <p className="text-gray-600">
        Each package comes with unique features and benefits to help you
        maximize your earnings.
      </p>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages?.map((plan, index) => {
          const getColorByIndex = () => {
            if (plan?.name === "Friend") return "bg-red-300";
            if (plan?.name === "Family") return "bg-purple-300";

            // Fallback to index-based color
            if (index === 0) return "bg-blue-300";
            if (index === 1) return "bg-green-300";
            if (index === 2) return "bg-yellow-300";
            if (index === 3) return "bg-blue-300";
            return "bg-gray-300"; // Default color
          };

          return (
            <div
              key={index}
              className={`rounded-xl ${plan.border} shadow-sm flex flex-col justify-between items-center py-8 transition duration-300 hover:bg-orange-100 hover:shadow-2xl`}
            >
              <h1 className="text-2xl font-bold text-black bg-orange-100 mb-4 px-4 py-2 w-full">
                {plan.name}
              </h1>

              <p className="text-start p-4">{plan?.description}</p>

              <h1
                className={`text-xl font-bold ${getColorByIndex()} mb-4 px-4 py-2 rounded-3xl`}
              >
                {plan.price}
              </h1>

              <ul className="text-left text-gray-700 text-sm space-y-2 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex text-base px-4 gap-2 items-start justify-start"
                  >
                    <GoPackage className="text-orange-400 font-semibold text-xl w-[10%]" />
                    <p className="w-[90%]">{feature}</p>
                  </li>
                ))}
              </ul>

              <li className="flex text-base px-4 gap-2 items-start justify-start">
                <GoPackage className="text-orange-400 font-semibold text-xl w-[10%]" />
              </li>

              <button
                onClick={() => handleAddPackage(plan)}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Buy Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
