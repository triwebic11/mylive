import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReferralTree from "../pages/dashboard/user/Referals/ReferralTree";
import MyReferral from "./MyReferral";
import BalanceConversion from "./BalanceConversion";
import ReferralLevelBadge from "./ReferralLevelBadge";
import useAxiosSecure from "../Hooks/useAxiosSecure";
const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    // 1. fetch user details
    axiosSecure
      .get(`/users/admin/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));

    // 2. fetch all bank info and filter current user's one
    axiosSecure
      .get("/profile/all")
      .then((res) => {
        const userBankInfo = res.data.find((info) => info.userId === id);
        setBankInfo(userBankInfo);
      })
      .catch((err) => console.error("Failed to load bank info", err));
  }, [axiosSecure, id]);

  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="p-6">
      <div>
        <Link
          to="/admin-dashboard/allUsers"
          className=" bg-amber-800 text-white border border-amber-500 px-2 py-1 rounded-xl hover:opacity-80 my-10 inline-block "
        >
          Go to Back
        </Link>
        <Link
          to="/dashboard"
          className=" bg-amber-800 text-white border border-amber-500 px-2 py-1 mx-6 rounded-xl hover:opacity-80 my-10 inline-block "
        >
          Go to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <ReferralLevelBadge />
      <div className="overflow-x-auto bg-white shadow rounded-lg mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left font-bold px-6 py-3 text-lg text-gray-700">
                Field
              </th>
              <th className="text-left px-6 py-3 text-lg font-bold text-gray-700">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">Name</td>
              <td className="px-6 py-3">{user.name}</td>
            </tr>
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">Email</td>
              <td className="px-6 py-3">{user.email}</td>
            </tr>
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">Phone</td>
              <td className="px-6 py-3">{user.phone}</td>
            </tr>
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">User ID</td>
              <td className="px-6 py-3">{user._id}</td>
            </tr>
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">
                Referral Code
              </td>
              <td className="px-6 py-3">{user.referralCode}</td>
            </tr>
            {/* Uncomment below line if you want to show referral tree in string form */}
            {/* <tr>
        <td className="px-6 py-3 font-medium text-gray-600">Referral Tree</td>
        <td className="px-6 py-3">{user.referralTree?.join(" > ")}</td>
      </tr> */}
            <tr className="hover:shadow-md shadow-gray-300">
              <td className="px-6 py-3 font-medium text-gray-600">Address</td>
              <td className="px-6 py-3">{user.address || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Bank Information</h2>
      {bankInfo ? (
        <div className="overflow-x-auto bg-white shadow rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Field
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">Bkash</td>
                <td className="px-6 py-3">{bankInfo.bkash || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">Nagad</td>
                <td className="px-6 py-3">{bankInfo.nagad || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">Rocket</td>
                <td className="px-6 py-3">{bankInfo.rocket || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">
                  Bank Name
                </td>
                <td className="px-6 py-3">{bankInfo.bankName || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">
                  Account No
                </td>
                <td className="px-6 py-3">{bankInfo.accountNumber || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">Holder</td>
                <td className="px-6 py-3">{bankInfo.accountHolder || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">Branch</td>
                <td className="px-6 py-3">{bankInfo.branch || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50 hover:shadow-md transition-all">
                <td className="px-6 py-3 font-medium text-gray-600">
                  Route No
                </td>
                <td className="px-6 py-3">{bankInfo.routeNo || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No bank info found for this user.</p>
      )}
      <h2 className="text-xl font-semibold mt-6 mb-2">Referral Information</h2>
      <div className="bg-white shadow rounded-2xl p-6 mt-6">
        <BalanceConversion userId={user._id} />
        <h3 className="text-lg font-semibold text-gray-700">
          🎁 Total Referral Points
        </h3>
        <p className="text-2xl text-green-600 font-bold">
          {user?.points || 0} Points
        </p>
      </div>
      <MyReferral referralCode={user?.referralCode} />
      <ReferralTree referralTree={user?.referralTree} />
    </div>
  );
};

export default UserDetails;
