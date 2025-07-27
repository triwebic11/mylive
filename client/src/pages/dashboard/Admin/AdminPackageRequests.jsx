import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const AdminPackageRequests = () => {
  const { user } = useAuth();
  const userId = user?.user?._id;
  // console.log("user id from admin page request = ", userId);
  const [requests, setRequests] = useState([]);
  const axiosSecure = useAxiosSecure();

  // console.log(requests)

  // Fetch all requests from backend
  useEffect(() => {
    axiosSecure
      .get("/package-requests")
      .then((res) => {
        const data = res.data;
        // console.log("your data form admin request aprove: ", data);
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.warn(" Not an array:", data);
          setRequests([]);
        }
      })
      .catch((err) => {
        console.error(" Fetch error:", err);
        setRequests([]);
      });
  }, [axiosSecure]);

  // Approve handler
  const handleApprove = async (id) => {
    try {
      const res = await axiosSecure.patch(`/package-requests/approve/${id}`);
      // console.log(res.data)
      // if(res.data.dsdsd === ""){
        
      //   Swal.fire("Approved!", "Package activated for user.", "success");
      // }

      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      console.error("Approval error:", err);
      Swal.fire("Error", "Could not approve the request.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-300"
        >
          Go Back to Dashboard
        </Link>
      </div>
      <h2 className="text-3xl font-bold text-center mb-8">Package Requests</h2>

      {requests?.length === 0 ? (
        <p className="text-center text-gray-500">No package requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-100">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border">Package</th>
                <th className="px-4 py-3 border">Price</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((req) => (
                <tr key={req._id} className="text-center">
                  <td className="px-4 py-2 border">{req?.name}</td>
                  <td className="px-4 py-2 border">{req?.email}</td>
                  <td className="px-4 py-2 border">{req?.phone}</td>
                  <td className="px-4 py-2 border">{req?.packageName}</td>
                  <td className="px-4 py-2 border">{req?.packagePrice}</td>
                  <td className="px-4 py-2 border font-semibold">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        req.status === "approved"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {req.status === "pending" ? (
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-gray-400">✔ Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPackageRequests;
