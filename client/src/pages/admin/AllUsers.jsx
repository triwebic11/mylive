import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";


const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const axiosSecure = useAxiosSecure();
  let userStatus = "Active"; // Assuming all users are active

  useEffect(() => {
    axiosSecure
      .get("/users/admin/all-users")
      .then((res) => {
        const reversedUsers = res.data.reverse();
        setUsers(reversedUsers);
        setFilteredUsers(reversedUsers);
      })
      .catch((err) => console.error("Failed to load users", err));
  }, [axiosSecure]);

  const filterUsersByRoleAndSearch = (role, term) => {
    const lowerTerm = term.toLowerCase();
    const filtered = users.filter((user) => {
      const matchesSearch =
        user._id.toLowerCase().includes(lowerTerm) ||
        user.phone?.toLowerCase().includes(lowerTerm) ||
        user.email?.toLowerCase().includes(lowerTerm) ||
        user.name?.toLowerCase().includes(lowerTerm);

      const matchesRole = role === "all" || user.role === role;

      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset page on filter/search change
  };

  const handleSearch = () => {
    filterUsersByRoleAndSearch(roleFilter, searchTerm);
  };

  const handleRoleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setRoleFilter(selectedRole);
    filterUsersByRoleAndSearch(selectedRole, searchTerm);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/updaterole/${userId}`, {
        role: newRole,
      });

      if (res.data?.message === "Role updated successfully") {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);

        // Also update filtered users based on current filter/search
        filterUsersByRoleAndSearch(roleFilter, searchTerm);
        Swal.fire({
              icon: "success",
              title: "Role updated",
              text: "Role updated successfully!",
              confirmButtonColor: "#3085d6",
            });

        
      } else {
        alert("Role update failed. Try again.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  // Calculate current page data slice
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const onPageChange = (page) => {
    if (page < 1 || page > Math.ceil(filteredUsers.length / itemsPerPage))
      return;
    setCurrentPage(page);
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

      {/* 🔍 Search and Role Filter */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by Phone, ID, Email or Name"
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

        <div className="flex items-center gap-2">
          <label htmlFor="roleFilter" className="font-medium">
            Filter by Role:
          </label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        All Registered Users{" "}
        <span className="text-gray-600">({filteredUsers.length})</span>
      </h1>

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td
                    className={`border border-black px-4 py-2 font-medium ${
                      userStatus === "Active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {userStatus}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={user?.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className={`rounded px-2 py-1 font-medium ${
                        user.role === "admin"
                          ? "text-green-600 font-semibold"
                          : "text-black"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/dashboard/user/${user._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-red-500 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={filteredUsers?.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AllUsers;
