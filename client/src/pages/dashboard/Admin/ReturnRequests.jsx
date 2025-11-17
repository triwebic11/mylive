import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ReturnRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axiosSecure.get("/admin-orders/dsp-return");
    setRequests(res.data);
  };

  const handleAction = async (id, actionType) => {
    const res = await axiosSecure.patch(
      `/admin-orders/dsp-return/handle/${id}`,
      {
        action: actionType,
      }
    );

    alert(res.data.message);
    fetchRequests(); // reload list
  };

  const filteredReturns = requests?.filter((order) => {
    const matchPhone = order.dspPhone
      ?.toLowerCase()
      .includes(searchPhone.toLowerCase());

    const matchProductId = order.productId
      ?.toLowerCase()
      .includes(searchProductId.toLowerCase());

    const matchStatus = order.status
      ?.toLowerCase()
      .includes(searchStatus.toLowerCase());

    return matchPhone && matchProductId && matchStatus;
  });

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">DSP Return Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Phone"
          className="border p-2 rounded"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by Product ID"
          className="border p-2 rounded"
          value={searchProductId}
          onChange={(e) => setSearchProductId(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">DSP Phone</th>
            <th className="border p-2">Product ID</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReturns.map((req) => (
            <tr key={req._id}>
              <td className="border p-2">{req.dspPhone}</td>
              <td className="border p-2">{req.productId}</td>
              <td className="border p-2">{req.quantity}</td>
              <td className="border p-2">{req.note || "-"}</td>

              <td className="border p-2">
                <span
                  className={`px-2 py-1 text-white rounded ${
                    req.status === "pending"
                      ? "bg-yellow-500"
                      : req.status === "approved"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {req.status}
                </span>
              </td>

              <td className="border p-2 text-center">
                {req.status === "pending" && (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleAction(req._id, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleAction(req._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {req.status !== "pending" && <span>No Action</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnRequests;
