import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AdminKycList = () => {
  const [kycList, setKycList] = useState([]);
  const axiosSecure = useAxiosSecure();

  const fetchKycList = async () => {
    try {
      const res = await axiosSecure.get("/kyc");
      setKycList(res.data);
      console.log("KYC List:", res.data);
    } catch (err) {
      console.error("Failed to fetch KYC list", err);
    }
  };

  useEffect(() => {
    fetchKycList();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/kyc/${newStatus}/${id}`);
      Swal.fire("Success", `KYC ${newStatus}ed successfully!`, "success");
      fetchKycList(); // Refresh list
    } catch (err) {
      console.error(`Failed to ${newStatus}`, err);
      Swal.fire("Error", `Failed to ${newStatus} KYC`, "error");
    }
  };

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">KYC Requests</h1>
      {kycList.length === 0 ? (
        <p>No KYC Requests Found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">User Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Front Image</th>
                <th className="p-2">Back Image</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {kycList.map((item) => (
                <tr key={item._id} className="text-center border-t">
                  <td className="p-2">{item.userId?.name || "N/A"}</td>
                  <td className="p-2">{item.userId?.email || "N/A"}</td>

                  {/* Front Image with hover zoom */}
                  <td className="p-2">
                    <div className="w-48 h-32">
                      <img
                        src={item.frontImage}
                        alt="Front"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[2]"
                      />
                    </div>
                  </td>

                  {/* Back Image with hover zoom */}
                  <td className="p-2">
                    <div className="w-48 h-32">
                      <img
                        src={item.backImage}
                        alt="Back"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[2]"
                      />
                    </div>
                  </td>

                  <td className="p-2 capitalize font-medium">{item.status}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(item._id, "verify")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      disabled={item.status === "verified"}
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item._id, "reject")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      disabled={item.status === "rejected"}
                    >
                      Reject
                    </button>
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

export default AdminKycList;
