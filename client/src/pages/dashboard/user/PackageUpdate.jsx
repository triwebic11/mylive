import React, { useState } from "react";

const plans = [
  {
    name: "Business",
    price: 20.83,
    yearlyPrice: "$249.99 Yearly Purchase",
    features: [
      "Up to 5 Websites",
      "15GB Storage",
      "200GB Bandwidth",
      "1 GB RAM per site",
      "3 PHP Workers per site",
      "1 CPU Core"
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 41.58,
    yearlyPrice: "$499.00 Yearly Purchase",
    features: [
      "Up to 15 Websites",
      "30 GB Storage",
      "400 GB Bandwidth",
      "1 GB RAM per site",
      "3 PHP Workers per site",
      "2 CPU Cores"
    ],
    extra: [
      "Free Malware Removal",
      "30 sec Average Support Response",
      "Free Fixes If Site Offline",
      "Free Site Speed Optimization",
      "30-day Money-Back Guarantee",
      "99.95% Uptime"
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: 83.25,
    yearlyPrice: "$999.00 Yearly Purchase",
    features: [
      "Up to 35 Websites",
      "60 GB Storage",
      "600 GB Bandwidth",
      "1 GB RAM per site",
      "3 PHP Workers per site",
      "3 CPU Cores"
    ],
    popular: false,
  },
  {
    name: "Custom",
    price: null,
    yearlyPrice: null,
    features: [],
    extra: [
      "Free Malware Removal",
      "30 sec Average Support Response",
      "Free Fixes If Site Offline",
      "Free Site Speed Optimization",
      "30-day Money-Back Guarantee",
      "99.95% Uptime"
    ],
    custom: true,
  },
];

export default function PackageUpdate() {
  const [billingCycle, setBillingCycle] = useState("yearly");

  return (
    <div className="py-12 bg-white text-center">
      <h2 className="text-3xl font-bold mb-2">
        Premium WordPress plans <br /> that will boost your site performance
      </h2>
      <p className="text-gray-600">
        Get the fastest version of your site thanks to our custom-built XDN technology.
        <br />
        Our Experts will migrate your site in less than 24 hours.
      </p>

      {/* Toggle Switch */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <span className={billingCycle === "monthly" ? "font-bold" : ""}>Monthly</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={billingCycle === "yearly"}
            onChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
        <span className={billingCycle === "yearly" ? "font-bold" : ""}>Yearly</span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-4 gap-6 mt-10 px-4 md:px-20">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border rounded-xl p-6 shadow-md relative flex flex-col items-center ${plan.popular ? "border-orange-500" : "border-gray-200"
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-t-xl text-sm font-semibold">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold text-orange-600 mb-2">{plan.name}</h3>
            {plan.price !== null ? (
              <>
                <p className="text-3xl font-bold">${plan.price} <span className="text-base font-normal">/month</span></p>
                <p className="text-sm text-gray-600 mb-4">{plan.yearlyPrice}<br />2 months FREE included</p>
                <button className="bg-orange-500 text-white px-5 py-2 rounded-full mb-4 hover:bg-orange-600">
                  Buy Now
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 text-sm mb-4">Get the best plan for you now!</p>
                <button className="bg-orange-500 text-white px-5 py-2 rounded-full mb-4 hover:bg-orange-600">
                  Contact Us
                </button>
              </>
            )}

            <ul className="text-sm text-gray-700 text-left space-y-1">
              {(plan.features.length > 0 ? plan.features : plan.extra).map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
