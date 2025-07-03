import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
const MobAndBankInfoForm = ({ user }) => {
  const userId = user?.user._id;

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
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure()

  // Fetch existing data
  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    axiosSecure
      .get(`/profile/accountsInfo/${userId}`)
      .then((res) => {
        if (res.data) {
          setFormData({
            bkash: res.data.bkash || "",
            nagad: res.data.nagad || "",
            rocket: res.data.rocket || "",
            bankName: res.data.bankName || "",
            accountNumber: res.data.accountNumber || "",
            accountHolder: res.data.accountHolder || "",
            branch: res.data.branch || "",
            routeNo: res.data.routeNo || "",
          });
        }
      })
      .catch((err) => {
        console.warn("No existing bank info found or error:", err.message);
      })
      .finally(() => setLoading(false));
  }, [axiosSecure, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await axiosSecure.post("/profile/accountsInfo", {
        userId,
        ...formData,
      });

      Swal.fire({
        icon: "success",
        title: "✅ Bank information created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Create Error:", error);
      alert("❌ Failed to create bank information.");
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.put(`/profile/${userId}`, formData);

      Swal.fire({
        icon: "success",
        title: "✅ Bank information updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Update Error:", error);
      alert("❌ Failed to update bank information.");
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return alert("❌ User not found. Please login again.");

    try {
      const res = await axiosSecure.get(
        `/profile/accountsInfo/${userId}`
      );
      if (res.data) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await handleCreate();
      } else {
        console.error("Check Error:", error);
        alert("❌ Something went wrong.");
      }
    }
  };

  return (
    <form
      onSubmit={handleCreateOrUpdate}
      className="space-y-6 p-4 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">
        Bank & Mobile Account Info
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Bkash No", name: "bkash" },
          { label: "Nagad No", name: "nagad" },
          { label: "Rocket No", name: "rocket" },
          { label: "Bank Name", name: "bankName" },
          { label: "Bank Account No", name: "accountNumber" },
          { label: "Account Holder", name: "accountHolder" },
          { label: "Branch", name: "branch" },
          { label: "Route No", name: "routeNo" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Save Information"}
        </button>
      </div>
    </form>
  );
};

export default MobAndBankInfoForm;
