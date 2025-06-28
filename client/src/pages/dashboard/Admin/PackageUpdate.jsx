/* eslint-disable no-unused-vars */
import React from "react";
import { GoPackage } from "react-icons/go";;
import useAuth from "../../../Hooks/useAuth";
import DashboardHeadings from "../../../components/DashboardHeadings";
import usePackages from "../../../Hooks/usePackages";




export default function PackageUpdate() {

  const [packages, isLoading, isError, error, refetch] = usePackages()

  const {user} = useAuth()
  console.log("user package compo", user);
  
  
  const handleAddPackage = (plan) => {
    console.log("Selected plan:", plan);
  }
  return (
    <div className="max-w-7xl mx-auto  py-16 px-4 text-center">
      {/* Header */}
      <DashboardHeadings heading={"Our Packages"} smalltext={"Choose the best package that suits your needs and start earning today!"}></DashboardHeadings>
      <p className="text-gray-600">
        Each package comes with unique features and benefits to help you maximize your earnings.
      </p>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages?.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl ${plan.border} shadow-sm flex flex-col justify-between items-center py-8 transition duration-300 hover:bg-orange-100 hover:shadow-2xl`}
          >
            <h1 className={`text-2xl font-bold text-black bg-orange-100  mb-4 px-4 py-2 w-full`}>{plan.name}</h1>

            <p className="text-start p-4">{plan?.description}</p>
            <h1 className={`text-xl font-bold ${plan?.name === "Platinum" && "bg-blue-300"} ${plan?.name === "Regular" && "bg-green-300"} ${plan?.name === "Gold" && "bg-red-300"} ${plan?.name === "Silver" && "bg-purple-300"} mb-4 px-4 py-2 rounded-3xl`}>{plan.price}</h1>
            <ul className="text-left text-gray-700 text-sm space-y-2 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex text-base px-4 gap-2 items-start justify-start"><GoPackage  className="text-orange-400 font-semibold text-xl w-[10%] " /> <p className="w-[90%]">{feature}</p></li>
              ))}
            </ul>
            <button onClick={() => handleAddPackage(plan)} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
