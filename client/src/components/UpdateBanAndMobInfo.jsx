import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/useAuth";

const MobAndBankInfoForm = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    bkash: "",
    nagad: "",
    rocket: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    routeNo: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch existing data when page loads
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/accoutsInfo${user._id}`)
      .then((res) => {
        const {
          bkash,
          nagad,
          rocket,
          bankName,
          accountNumber,
          accountHolder,
          branch,
          routeNo,
        } = res.data;
        setFormData({
          bkash: bkash || "",
          nagad: nagad || "",
          rocket: rocket || "",
          bankName: bankName || "",
          accountNumber: accountNumber || "",
          accountHolder: accountHolder || "",
          branch: branch || "",
          routeNo: routeNo || "",
        });
      });
  }, [user._id]);

  console.log("Your bank and mobile information: ", formData);
  // Submit data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/users/${user._id}`, formData);
    alert("✅ Bank Information updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span>Bkash No</span>
          <input
            type="text"
            name="bkash"
            value={formData.bkash}
            onChange={handleChange}
            placeholder="Bkash No"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Nagad No</span>
          <input
            type="text"
            name="nagad"
            value={formData.nagad}
            onChange={handleChange}
            placeholder="Nagad No"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Rocket No</span>
          <input
            type="text"
            name="rocket"
            value={formData.rocket}
            onChange={handleChange}
            placeholder="Rocket No"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Bank Name</span>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Bank Account No</span>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Account Holder</span>
          <input
            type="text"
            name="accountHolder"
            value={formData.accountHolder}
            onChange={handleChange}
            placeholder="Account Holder Name"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Branch</span>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <span>Route No</span>
          <input
            type="text"
            name="routeNo"
            value={formData.routeNo}
            onChange={handleChange}
            placeholder="Route No"
            className="w-full px-2 py-1 outline-0 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default MobAndBankInfoForm;
