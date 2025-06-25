import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Dashboard from "./dashboard/Dashboard.jsx";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    division: "",
    password: "",
    referralCode: "",
  });

  const [userReferralCode, setUserReferralCode] = useState("");
  const [referralTree, setReferralTree] = useState([]);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );

      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        division: form.division,
        password: form.password,
        referralCode: res.data.referralCode,
        referralTree: res.data.referralTree,
        _id: res.data.userId,
      };

      // ✅ Local Storage-এ user data রাখো
      localStorage.setItem("user", JSON.stringify(userData));
      setUserReferralCode(res.data.referralCode);
      setReferralTree(res.data.referralTree);
      setRegisteredUser(userData);

      Swal.fire({
        icon: "success",
        title: "Registration is Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login", {
        state: { user: userData },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <h2 className="text-3xl text-center my-6">User Registration</h2>
      <form onSubmit={handleSubmit}>
        <h2>Full Name*</h2>
        <input
          name="name"
          onChange={handleChange}
          value={form.name}
          placeholder="Your Name"
          required
          className="border border-gray-300 px-2 py-1 rounded-md "
        />
        <br />
        <h1>Email*</h1>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={form.email}
          placeholder="Email"
          required
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <h1>Phone Number</h1>
        <input
          name="phone"
          type="text"
          onChange={handleChange}
          value={form.phone}
          placeholder="Phone Number"
          required
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <h1>Dath Of Birth</h1>
        <input
          name="dob"
          type="date"
          onChange={handleChange}
          value={form.dob}
          placeholder="Dath Of Birth"
          required
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <div>
          <label
            htmlFor={name}
            className="block text-base font-medium text-gray-700 mb-1"
          >
            Select Division
          </label>
          <select
            name="division"
            onChange={handleChange}
            value={form.division}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select Division</option>
            <option value="Chattagram">Chattagram</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Khulna">Khulna</option>
          </select>
        </div>
        <h2>Enter a new password</h2>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Password"
          required
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />{" "}
        <br />
        <h2>Referrer ID</h2>
        <input
          name="referralCode"
          onChange={handleChange}
          value={form.referralCode}
          placeholder="Referral Code (optional)"
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 duration-200"
        >
          Register
        </button>
      </form>
      {registeredUser && <Dashboard user={registeredUser} />}
    </div>
  );
};

export default Register;

{
  /* {userReferralCode && (
  <div style={{ marginTop: "30px" }}>
    <h3>🎉 Registration Successful!</h3>
    <p>
      <strong>Your Referral Code:</strong> {userReferralCode}
    </p>
    <QRCode
      value={`http://localhost:5174/register?ref=${userReferralCode}`}
    />
    <p style={{ marginTop: "10px" }}>
      <strong>Your 10-Level Upline:</strong>
    </p>
    <ul>
      {referralTree.map((id, i) => (
        <li key={id}>
          Level {i + 1} → {id}
        </li>
      ))}
    </ul>
  </div>
)} */
}
// import { useContext } from "react";
// import AuthProvider from "../AuthProvider/AuthProvider";
// import { set, useForm } from "react-hook-form";
// import FormInput from "../components/FormInput"; // adjust the path as needed
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import axios from "axios";
// import Swal from "sweetalert2";
// import useAuth from "../Hooks/useAuth";
// import useAxiosPublic from "../Hooks/useAxiosPublic";

// const Register = () => {

//   const { setUser,user:users } = useAuth()
//       const axiosPublic = useAxiosPublic()

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       console.log("Registration Data:", data);

//       const datas = {
//         ...data,
//         role: "user",
//       };

//       const res = await axiosPublic.post(
//         "/users/register",
//         datas
//       );

//       console.log(res.data);

//       if (res.data.message === "User registered successfully") {
//         console.log("✅ Registration successful");
//         Swal.fire({
//           icon: "success",
//           title: "Registration successful",
//           text: "You have been successfully register",
//           confirmButtonColor: "#3085d6",
//           confirmButtonText: "OK",
//         });
//         localStorage.setItem("user", JSON.stringify(res.data));
//         setUser(res.data.user);
//         navigate("/dashboard", {
//           state: { user: res.data.user },
//         });
//       }

//       return res.data;
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         // Phone number already exists
//         const message = error.response.data.message;
//         if (message === "Phone Number already exists") {
//           console.log("🚫 Phone Number already exists");
//         }
//       } else {
//         console.error("🔥 Server error:", error.message);
//       }
//     }
//   };

//   const storedUser = localStorage.getItem("user");
//   const user =
//     storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
//   if (user && user.token) {
//     console.log("user permanant");
//     // User is logged in
//   }

//   const password = watch("password");

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen py-10">
//       <Link to="/" className="flex items-center gap-2 py-5 ">
//         <img src={logo} alt="logo" className="w-20" />
//         <p className="text-2xl font-semibold">SHS Lira Enterprise Ltd</p>
//       </Link>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-6 rounded-md w-full max-w-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <FormInput
//           label="Full Name *"
//           placeholder="Name"
//           name="name"
//           register={register}
//           validation={{ required: "Name is required" }}
//           error={errors.name}
//         />
//         <FormInput
//           label="Phone Number *"
//           placeholder="Phone"
//           name="phone"
//           register={register}
//           validation={{ required: "Phone is required" }}
//           error={errors.phone}
//         />
//         <FormInput
//           label="Email *"
//           placeholder="Email or Phone"
//           name="email"
//           register={register}
//           validation={{ required: "Email or Phone is required" }}
//           error={errors.email}
//         />
//         <FormInput
//           label="Date Of Birth *"
//           type="date"
//           name="dob"
//           register={register}
//           validation={{ required: "Date of Birth is required" }}
//           error={errors.dob}
//         />
//         <div>
//           <FormInput
//             label="Referrer ID"
//             placeholder="Referrer ID"
//             type="text"
//             name="referredBy"
//             register={register}
//           />
//           <p className="text-green-600 text-sm">Not Found</p>
//         </div>
//         <div>
//           <FormInput
//             label="Placement ID"
//             placeholder="Placement ID"
//             name="placementId"
//             register={register}
//           />
//           <p className="text-green-600 text-sm">Not Found</p>
//         </div>

//         <div>
//           <label
//             htmlFor={name}
//             className="block text-base font-medium text-gray-700 mb-1"
//           >
//             Select Division
//           </label>
//           <select
//             {...register("division")}
//             className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//           >
//             <option value="">Select Division</option>
//             <option value="Chattagram">Chattagram</option>
//             <option value="Dhaka">Dhaka</option>
//             <option value="Khulna">Khulna</option>
//           </select>
//         </div>

//         <FormInput
//           label={"City *"}
//           placeholder="City"
//           name="city"
//           register={register}
//           defaultValue="Dhaka"
//         />
//         <FormInput
//           label={"Post Code *"}
//           placeholder="Post Code"
//           name="postcode"
//           register={register}
//         />
//         <FormInput
//           label={"Address *"}
//           placeholder="Address"
//           name="address"
//           register={register}
//           defaultValue="...Dhaka"
//         />
//         <FormInput
//           label={"Password *"}
//           type="password"
//           placeholder="Password"
//           name="password"
//           register={register}
//           validation={{
//             required: "Password is required",
//             minLength: { value: 6, message: "Minimum 6 characters" },
//           }}
//           error={errors.password}
//         />
//         <FormInput
//           label={"Confirm Password *"}
//           type="password"
//           placeholder="Confirm Password"
//           name="confirmPassword"
//           register={register}
//           validation={{
//             validate: (value) => value === password || "Passwords do not match",
//           }}
//           error={errors.confirmPassword}
//         />

//         <div className="col-span-2">
//           <label className="inline-flex items-center gap-2">
//             <input
//               type="checkbox"
//               {...register("agree", { required: "You must agree to terms" })}
//             />
//             <span>
//               I Agree <a className="underline">Terms And Condition</a>
//             </span>
//           </label>
//           {errors.agree && (
//             <p className="text-red-500 text-sm">{errors.agree.message}</p>
//           )}
//         </div>

//         <div className="col-span-2 flex justify-between items-center">
//           <Link to="/login" className="text-blue-600 text-sm underline">
//             Already registered? Go to Login
//           </Link>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             REGISTER
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register;
