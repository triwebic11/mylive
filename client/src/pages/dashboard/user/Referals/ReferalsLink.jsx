import React from "react";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const ReferLinkPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const referralCode = storedUser?.user?.referralCode;
  console.log("your referral code is- ",referralCode);
  const referLink = `https://localhost:5000/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referLink);
    alert("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join Now!",
          text: "Register with my referral link",
          url: referLink,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Share not supported on this device.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Refer Link
      </h1>
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full max-w-sm">
        <QRCodeCanvas value={referLink} size={256} className="mb-4" />
        <div className="w-full">
          <input
            type="text"
            value={referLink}
            readOnly
            className="w-full text-center bg-gray-100 rounded-lg px-4 py-2 mb-4 border border-gray-300"
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaCopy /> Copy
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferLinkPage;
