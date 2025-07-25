// ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosSecure.post(`/auth/reset-password/${token}`, {
        password,
      });
      Swal.fire({
        icon: "success",
        title: "Reset Successful",
        text: "Your password has been reset successfully.",
      });
      setMessage(res.data.message);
      setError("");
      setPassword("");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <div className="max-w-md flex justify-center items-center mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
        Reset Password
      </h2>

      {message && <p className="text-green-600 text-center mb-2">{message}</p>}
      {error && <p className="text-red-600 text-center mb-2">{error}</p>}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Set New Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
