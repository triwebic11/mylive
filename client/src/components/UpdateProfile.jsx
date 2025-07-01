import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const UpdateProfileInfo = ({ user }) => {
  const userId = user?._id;
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

  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure()

  // 🔄 Load profile info from backend
  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    axiosSecure
      .get(`/users/${userId}`)
      .then((res) => {
        if (res.data) {
          const user = res.data;
          setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            division: user.division || "",
            city: user.city || "",
            postcode: user.postcode || "",
            address: user.address || "",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load user info:", err);
      })
      .finally(() => setLoading(false));
  }, [axiosSecure, userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not found");

    try {
      await axiosSecure.put(`/users/${userId}`, form);

      Swal.fire("✅ Success", "Profile updated successfully!", "success");

      // ✅ Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        user: { ...storedUser.user, ...form },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      Swal.fire(
        "❌ Error",
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
        {/* Fields */}
        {[
          { label: "Full Name", name: "name" },
          { label: "Email", name: "email" }, // ✅ ঠিক করা
          { label: "Phone", name: "phone" }, // ✅ ঠিক করা
          { label: "Date of Birth", name: "dob", type: "date" },
          { label: "Division", name: "division", type: "select" },
          { label: "City", name: "city" },
          { label: "Post Code", name: "postcode" },
          { label: "Address", name: "address", colSpan: 2 },
        ].map(({ label, name, type = "text", colSpan }) => (
          <div key={name} className={colSpan === 2 ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium">{label}</label>

            {type === "select" ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md mt-1"
              >
                <option value="">Select Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattagram">Chattagram</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Barishal">Barishal</option>
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md mt-1"
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileInfo;
