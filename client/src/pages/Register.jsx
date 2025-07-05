import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard.jsx";
import useAuth from "../Hooks/useAuth.jsx";
import useAxiosPublic from "../Hooks/useAxiosPublic.jsx";

const Register = () => {
  const { setUser } = useAuth();
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
  const axiosPublic = useAxiosPublic()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPublic.post("/users/register",form);
      console.log("Registration response:", res.data);

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

      localStorage.setItem("user", JSON.stringify(userData));
      setUserReferralCode(res.data.referralCode);
      setReferralTree(res.data.referralTree);
      setRegisteredUser(userData);
      setUser(userData);

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 rounded-5xl px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        User Registration
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
      >
        <div>
          <label>Full Name*</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>Email*</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>Phone Number*</label>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>Select Division</label>
          <select
            name="division"
            value={form.division}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          >
            <option value="">Select Division</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattagram">Chattagram</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Barishal">Barishal</option>
          </select>
        </div>

        <div>
          <label>Enter a new password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label>Post Code</label>
          <input
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
            placeholder="Post Code"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div className="lg:col-span-2">
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div className="lg:col-span-2">
          <label>Referrer ID</label>
          <input
            name="referralCode"
            value={form.referralCode}
            onChange={handleChange}
            placeholder="Referral Code (optional)"
            className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div className="lg:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </div>
      </form>

      {registeredUser && <Dashboard user={registeredUser} />}
    </div>
  );
};

export default Register;
