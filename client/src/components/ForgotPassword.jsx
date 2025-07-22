// src/pages/ForgotPassword.jsx

import { useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
