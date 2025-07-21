import { useParams } from "react-router-dom";
import { useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const ResetPassword = () => {
  const { token } = useParams();
  const axiosSecure = useAxiosSecure();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Token expired or invalid.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          className="border w-full p-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default ResetPassword;
