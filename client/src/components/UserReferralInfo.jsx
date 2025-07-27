import React from "react";

import MyReferrals from "../pages/dashboard/user/Referals/MyReferrals";
import ReferralTree from "../pages/dashboard/user/Referals/ReferralTree";
const Dashboard = ({ user }) => {
  // const storedUser = JSON.parse(localStorage.getItem("user"));
  // const user = storedUser?.user || {};
  // // console.log("User data: ", user);
  // const referralCode = storedUser?.user?.referralCode;
  const referralCode = user?.referralCode;
  // console.log("your referral code is- ", referralCode);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upline Tree */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          📚 Referral Upline Tree
        </h3>
        {user?.referralTree?.length === 0 ? (
          <p className="text-gray-500">You were not referred by anyone.</p>
        ) : (
          <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
            {user?.referralTree?.map((id, index) => (
              <li key={id}>
                <span className="font-medium">Level {index + 1}:</span> {id}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Profile Info */}

      <div className="bg-white shadow rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          🎁 Total Referral Points
        </h3>
        <p className="text-2xl text-green-600 font-bold">
          {user?.points || 0} Points
        </p>
      </div>

      <MyReferrals referralCode={referralCode} />
      <ReferralTree referralTree={user?.referralTree} />
    </div>
  );
};

export default Dashboard;
