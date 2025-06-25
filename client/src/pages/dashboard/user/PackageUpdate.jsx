import React from "react";
import { IoMdPaperPlane } from "react-icons/io";

const plans = [
  {
    "id": "1",
    "price": "2,000 TK",
    "PV": "1000",
    "name": "Regular",
    "description": "Basic membership with standard referral benefits.",
    "referralBonusPercent": 5,
    "monthlyFee": 0,
    "maxReferrals": 10,
    "features": [
      "Basic referral tracking",
      "Access to limited offers",
      "Email support",
      "Referral bonus on first purchase",
      "Monthly Bonus",
      "Level 3 referral bonus",
      "Level 3 14 ways commission bonus"
    ]
  },
  {
    "id": "2",
    "price": "5,000 TK",
    "PV": "2500",
    "name": "Silver",
    "description": "Silver membership with improved referral bonus.",
    "referralBonusPercent": 10,
    "monthlyFee": 5,
    "maxReferrals": 50,
    "features": [
      "Email support",
      "Higher referral bonus",
      "Referral bonus on first purchase",
      "Monthly Bonus",
      "Level 10 referral bonus",
      "Level 10 14 ways commission bonus",
      "Priority support",
      "Access to silver-only deals"
    ]
  },
  {
    "id": "3",
    "price": "15,000 TK",
    "PV": "7500",
    "name": "Gold",
    "description": "Gold membership with advanced referral benefits.",
    "referralBonusPercent": 15,
    "monthlyFee": 15,
    "maxReferrals": 200,
    "features": [
      "Email support",
      "Higher referral bonus",
      "Referral bonus on first purchase",
      "Monthly Bonus",
      "Level 20 referral bonus",
      "Level 20 14 ways commission bonus",
      "24/7 support",
      "Exclusive gold member deals",
      "Referral leaderboard access"
    ]
  },
  {
    "id": "4",
    "price": "35,000 TK",
    "PV": "17500",
    "name": "Platinum",
    "description": "Premium membership with maximum referral benefits.",
    "referralBonusPercent": 25,
    "monthlyFee": 30,
    "maxReferrals": 1000,
    "features": [
      "Email support",
      "Highest referral bonus",
      "Referral bonus on first purchase",
      "Monthly Bonus",
      "Unlimited Level referral bonus",
      "Unlimited 14 ways commission bonus",
      "Dedicated account manager",
      "Early access to new products",
      "Exclusive platinum member events"
    ]
  }
]
;

export default function PackageUpdate() {
  return (
    <div className="max-w-7xl mx-auto  py-16 px-4 text-center">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">SHS Lira</h1>
      <p className="text-gray-600 mb-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo illo rem et alias nulla iusto
      </p>
      <p className="text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipisicing.
      </p>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl ${plan.border} shadow-sm flex flex-col justify-between items-center py-8 transition duration-300 hover:bg-orange-100 hover:shadow-2xl`}
          >
            <h1 className={`text-2xl font-bold text-black bg-orange-100  mb-4 px-4 py-2 w-full`}>{plan.name}</h1>

            <p className="text-start p-4">{plan?.description}</p>
            <h1 className={`text-xl font-bold ${plan?.name === "Platinum" && "bg-blue-300"} ${plan?.name === "Regular" && "bg-green-300"} ${plan?.name === "Gold" && "bg-red-300"} ${plan?.name === "Silver" && "bg-purple-300"} mb-4 px-4 py-2 rounded-3xl`}>{plan.price}</h1>
            <ul className="text-left text-gray-700 text-sm space-y-2 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex text-lg px-4 gap-2 items-start"><IoMdPaperPlane className="text-orange-400 font-semibold text-lg" /> <p>{feature}</p></li>
              ))}
            </ul>
            <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
