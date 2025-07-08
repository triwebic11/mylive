import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const AdminWithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();

  // Load withdraw requests
  useEffect(() => {
    axiosSecure
      .get("/withdraw-requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to fetch requests", err));
  }, [axiosSecure]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const confirm = await Swal.fire({
        title: `Are you sure to ${status} this request?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${status} it`,
      });

      if (confirm.isConfirmed) {
        await axiosSecure.patch(`/withdraw-requests/${id}/status`, { status });

        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status } : req))
        );

        Swal.fire("Success", `Request has been ${status}.`, "success");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      Swal.fire("Error", "Failed to update request status", "error");
    }
  };
  const filteredRequests = requests.filter((req) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      req.name.toLowerCase().includes(lowerSearch) ||
      req.phone.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <div>
        <Link
          to="/dashboard"
          className="px-2 py-1 border border-gray-500 rounded-md text-lg shadow-lg hover:shadow-none duration-200"
        >
          Go Back
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Withdraw Requests</h2>
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="border px-4 py-2 rounded-md shadow-sm w-full md:w-1/3 focus:outline-none focus:ring focus:ring-blue-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No withdraw requests found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Points</th>
              <th className="px-4 py-2 text-left">Requested At</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => {
              const date = new Date(req.createdAt).toLocaleString("en-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{req.name}</td>
                  <td className="px-4 py-2">{req.phone}</td>
                  <td className="px-4 py-2">{req.points}</td>
                  <td className="px-4 py-2">{date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-500"
                          : req.status === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(req._id, "approved")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(req._id, "rejected")
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">No Action</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminWithdrawRequests;
