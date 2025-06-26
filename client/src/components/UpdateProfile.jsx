import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProfileInfo = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    division: "",
    city: "",
    postcode: "",
    address: "",
  });

  useEffect(() => {
    if (storedUser) {
      setForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        dob: storedUser.dob || "",
        division: storedUser.division || "",
        city: storedUser.city || "",
        postcode: storedUser.postcode || "",
        address: storedUser.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        form
      );

      Swal.fire("Success", "Profile updated successfully!", "success");

      const updatedUser = { ...storedUser, ...form };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Profile Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Division</label>
          <select
            name="division"
            value={form.division}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
          >
            <option value="">Select Division</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattagram">Chattagram</option>
            <option value="Khulna">Khulna</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Post Code</label>
          <input
            type="text"
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileInfo;
