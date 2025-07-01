import React, { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import axios from "axios";

// 📦 Define style & emoji by package
const packageStyles = {
  Normal: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    emoji: "📦",
    level: 5,
  },
  Silver: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    emoji: "🥈",
    level: 10,
  },
  Gold: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    emoji: "🥇",
    level: 15,
  },
  Platinum: {
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    emoji: "💎",
    level: "Unlimited",
  },
};

export default function ReferralLevelBadge() {
  const [userPackage, setUserPackage] = useState(null);
  const { user } = useAuth();
  const userId = user?.user?._id;

  useEffect(() => {
    const fetchPackage = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/package-requests/${userId}`
        );
        setUserPackage(res.data);
        localStorage.setItem("userPackage", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch user package request:", err);
      }
    };

    fetchPackage();
  }, [userId]);

  if (!userPackage?.packageName)
    return <div className="text-gray-600">Sorry, no package found.</div>;

  const current =
    packageStyles[userPackage.packageName] || packageStyles["Normal"];

  return (
    <div
      className={`px-5 py-4 rounded-xl inline-block shadow-md border-l-4 border-black ${current.bg} ${current.text}`}
    >
      <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
        <span className="text-2xl">{current.emoji}</span>
        Package: {userPackage.packageName}
      </h1>
      <h2 className="text-base sm:text-lg font-medium">
        Referral Level:{" "}
        <span className="font-bold">
          {typeof current.level === "string"
            ? current.level
            : `${current.level} Generation`}
        </span>
      </h2>
    </div>
  );
}
