import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);

  useEffect(() => {
    // 1. fetch user details
    axios
      .get(`http://localhost:5000/api/users/admin/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));

    // 2. fetch all bank info and filter current user's one
    axios
      .get("http://localhost:5000/api/profile/all")
      .then((res) => {
        const userBankInfo = res.data.find((info) => info.userId === id);
        setBankInfo(userBankInfo);
      })
      .catch((err) => console.error("Failed to load bank info", err));
  }, [id]);

  if (!user) return <div>Loading user info...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
        <div>
          <strong>Referral Code:</strong> {user.referralCode}
        </div>
        <div>
          <strong>Referral Tree:</strong> {user.referralTree?.join(" > ")}
        </div>
        <div>
          <strong>Address:</strong> {user.address || "N/A"}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Bank Information</h2>
      {bankInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
          <div>
            <strong>Bkash:</strong> {bankInfo.bkash}
          </div>
          <div>
            <strong>Nagad:</strong> {bankInfo.nagad}
          </div>
          <div>
            <strong>Rocket:</strong> {bankInfo.rocket}
          </div>
          <div>
            <strong>Bank Name:</strong> {bankInfo.bankName}
          </div>
          <div>
            <strong>Account No:</strong> {bankInfo.accountNumber}
          </div>
          <div>
            <strong>Holder:</strong> {bankInfo.accountHolder}
          </div>
          <div>
            <strong>Branch:</strong> {bankInfo.branch}
          </div>
          <div>
            <strong>Route No:</strong> {bankInfo.routeNo}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No bank info found for this user.</p>
      )}
      <div>
        <Link
          to="/allUsers"
          className=" bg-amber-800 text-white border border-amber-500 px-2 py-1 rounded-xl hover:opacity-80 my-10 inline-block "
        >
          Go to Back
        </Link>
        <Link
          to="/dashboard"
          className=" bg-amber-800 text-white border border-amber-500 px-2 py-1 rounded-xl hover:opacity-80 my-10 inline-block "
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;
