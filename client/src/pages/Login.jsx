import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { logo } from "../assets/index.js";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axiosPublic.post("/users/login", data);
      const loggedInUser = res?.data;

      console.log("logeed", loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/dashboard");
      localStorage.setItem("userId", res.data.user._id);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response.data.message || "Invalid credentials",
        });
      } else {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Phone Number / User ID
          </label>
          <input
            type="text"
            {...register("phone", { required: "Phone is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* 🔒 Password with show/hide toggle */}
        <div className="mb-6 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer hover:opacity-80 duration-200"
        >
          Login
        </button>
        <Link
          to="/forgot-password"
          className="text-blue-600 underline block text-center mt-4 hover:opacity-80 duration-200"
        >
          Forgot Password?
        </Link>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 underline cursor-pointer hover:opacity-80 duration-200"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
