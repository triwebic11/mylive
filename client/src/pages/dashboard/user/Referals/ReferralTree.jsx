import { useEffect, useState } from "react";
import axios from "axios";

const ReferralTree = ({ referralTree }) => {
  const [uplines, setUplines] = useState([]);

  useEffect(() => {
    if (referralTree.length > 0) {
      axios
        .post("http://localhost:5000/api/users/referral-tree", { ids: referralTree })
        .then((res) => setUplines(res.data))
        .catch((err) => console.error("Failed to load tree", err));
    }
  }, [referralTree]);

  return (
    <div className="bg-white shadow rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">🌳 10-Level Upline Tree</h3>

      {uplines.length === 0 ? (
        <p className="text-gray-500">No upline (you registered without a referral).</p>
      ) : (
        <ul className="space-y-3">
          {uplines.map((upline, index) => (
            <li
              key={upline?._id || index}
              className="border p-3 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">Level {index + 1}</p>
                <p className="text-sm text-gray-600">{upline?.name || "N/A"}</p>
                <p className="text-xs text-gray-500">{upline?.email || "Unknown"}</p>
              </div>
              <span className="text-xs text-gray-400">{upline?._id || "Deleted"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReferralTree;
