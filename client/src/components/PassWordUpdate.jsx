import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";

const UpdatePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "New passwords do not match", "error");
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { currentPassword, newPassword }
      );

      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="mt-6">
      <h1 className="text-xl font-bold">Update Password</h1>
      <p>
        Ensure your account is using a long, random password to stay secure.
      </p>

      <div className="my-4">
        <span>Current Password</span>
        <div className="px-2 py-1 border border-gray-300 rounded-lg">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-2 py-1 outline-0"
          />
        </div>
      </div>

      <div className="mt-4">
        <span>New Password</span>
        <div className="px-2 py-1 border border-gray-300 rounded-lg">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-2 py-1 outline-0"
          />
        </div>
      </div>

      <div className="mt-4">
        <span>Confirm New Password</span>
        <div className="px-2 py-1 border border-gray-300 rounded-lg">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-2 py-1 outline-0"
          />
        </div>
      </div>

      <button
        onClick={handlePasswordUpdate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Update Password
      </button>
    </div>
  );
};

export default UpdatePassword;
