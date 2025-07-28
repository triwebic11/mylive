import React, { useEffect, useState } from "react";
// import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// 📦 Define style & emoji by package

const packageStyles = {
  Friend: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    emoji: "📦",
    level: 3,
  },
  Family: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    emoji: "🥈",
    level: 5,
  },
  "Business Relative": {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    emoji: "🥇",
    level: 7,
  },
  "Business Relation": {
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    emoji: "💎",
    level: 10,
  },
  Normal: {
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    emoji: "📄",
    level: 0,
  },
};

export default function ReferralLevelBadge({ data }) {
  const [userPackage, setUserPackage] = useState(null);
  // const { user } = useAuth();
  // const userId = user?.user?._id;
  const axiosSecure = useAxiosSecure();
  console.log("ReferralLevelBadge data:", data);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!data) return;
      try {
        const res = await axiosSecure.get(`/package-requests/${data}`);
        setUserPackage(res.data);
        localStorage.setItem("userPackage", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user package request:", err);
      }
    };

    fetchPackage();
  }, [axiosSecure, data]);

  // if (!data?.packageName)
  //   return <div className="text-gray-600">Sorry, no package found.</div>;

  const current =
    packageStyles[data?.packageName] || packageStyles["Normal"];

  return (
    <div
      className={`px-5 py-4 rounded-xl inline-block shadow-md border-l-4 border-black ${current.bg} ${current.text}`}
    >
      <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
        <span className="text-2xl">{current.emoji}</span>
        Package: {data?.package || "Normal"}
      </h1>
      <h2 className="text-base sm:text-lg font-medium">
        Generation Level:{" "}
        <span className="font-bold">
           {data?.GenerationLevel || 0 } Generation
        </span>
      </h2>
      <h2 className="text-base sm:text-lg font-medium">
        Mega Generation Level:{" "}
        <span className="font-bold">
           {data?.MegaGenerationLevel || 0 } Generation
        </span>
      </h2>
    </div>
  );
}
