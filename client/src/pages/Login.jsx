import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic()

  const onSubmit = async (data) => {
    try {
<<<<<<< HEAD
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
=======
      const res = await axiosPublic.post(
        "/users/login",
>>>>>>> bbaccfe9b54a016cd416b0c936af57ae2eaae710
        data
      );
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

      navigate("/dashboard"); // redirect to dashboard or home
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            {...register("phone", { required: "Phone is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
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
