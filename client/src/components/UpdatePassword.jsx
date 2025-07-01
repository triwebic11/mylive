import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdatePassword = ({ user }) => {
  const userId = user?.user._id;
  console.log("User ID from UpdatePassword component:", userId);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!userId) {
      return Swal.fire("User not found", "Please login again", "error");
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire(
        "Password Mismatch",
        "New passwords do not match",
        "warning"
      );
    }

    try {
      const response = await axios.put(
        `https://apidata.shslira.com/api/users/update-password/${userId}`,
        {
          currentPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success");
        // Clear inputs
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire("Failed", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handlePasswordUpdate}
      className="space-y-4 mt-10 flex justify-center items-center w-full flex-col min-h-screen"
    >
      <h2 className="text-xl font-semibold mb-4">🔐 Update Password</h2>
      <div>
        <label>Current Password</label>
        <br />
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className=" px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label>New Password</label>
        <br />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label>Confirm New Password</label>
        <br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="px-3 py-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        Update Password
      </button>
    </form>
  );
};

export default UpdatePassword;
