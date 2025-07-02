import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const axiosSecure = useAxiosSecure()
  let userStatus = "Active"; // Assuming all users are active for now

  useEffect(() => {
    axiosSecure
      .get("/users/admin/all-users")
      .then((res) => {
        const reversedUsers = res.data.reverse(); // ✅ এখানেই reverse করো
        setUsers(reversedUsers);
        setFilteredUsers(reversedUsers);
      })
      .catch((err) => console.error("Failed to load users", err));
  }, [axiosSecure]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = users.filter(
      (user) =>
        user._id.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term)
    );
    setFilteredUsers(results);
  };

  return (
    <div className="max-w-[1900px] p-6">
      <div>
        <Link
          to="/dashboard"
          className=" bg-amber-800 text-white border border-amber-500 px-2 py-1 rounded-xl hover:opacity-80 my-10 inline-block "
        >
          Go to Dashboard
        </Link>
      </div>

      {/* 🔍 Search Box */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by Phone or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">All Registered Users</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td
                className={`border px-4 py-2 font-medium ${
                  userStatus === "Active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {userStatus}
              </td>
              <td className="border px-4 py-2">
                <Link
                  to={`/admin-dashboard/user/${user._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-red-500 py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
