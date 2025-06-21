import React from "react";

const plans = [
  {
    title: "Platinam",
    features: [
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",

    ],
    border: "border",
  },
  {
    title: "Gold",
    features: [
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",

    ],
    border: "border",
  },
  {
    title: "Silver",
    features: [
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
    ],
    border: "border",
  },
  {
    title: "Regular",
    features: [
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
      "SHS Lira ",
    ],
    border: "border",
  },
];

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
            className={`rounded-xl ${plan.border} shadow-sm p-6 flex flex-col justify-between items-center hover:shadow-md transition duration-300`}
          >
            <h2 className="text-xl font-bold text-orange-600 mb-4">{plan.title}</h2>
            <ul className="text-left text-gray-800 text-sm space-y-1 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
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
