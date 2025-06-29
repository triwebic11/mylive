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
    city: "",
    postcode: "",
    address: "",
    password: "",
    referralCode: "",
  });

  const [userReferralCode, setUserReferralCode] = useState("");
  const [referralTree, setReferralTree] = useState([]);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [activePackeg, setActivePackeg] = useState("unactive");

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
        city: form.city,
        postcode: form.postcode,
        address: form.address,
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

      navigate("/packeg-active", {
        state: { user: userData },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <h2 className="text-3xl text-center my-6">User Registration</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-4 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2"
      >
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
        <h1>Phone Number*</h1>
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
            id="division"
            type="text"
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
        <h2>City</h2>
        <input
          name="city"
          type="text"
          onChange={handleChange}
          value={form.city}
          placeholder="City"
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <h2>Post Code</h2>
        <input
          name="postcode"
          type="text"
          onChange={handleChange}
          value={form.postcode}
          placeholder="Post Code"
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
        <br />
        <h2>Address</h2>
        <input
          name="address"
          onChange={handleChange}
          value={form.address}
          placeholder="Address"
          className="border border-gray-300 px-2 py-1 rounded-md my-2"
        />
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
