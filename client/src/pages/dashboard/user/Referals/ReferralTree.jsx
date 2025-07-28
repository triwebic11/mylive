import { useEffect, useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
const ReferralTree = ({ referralTree }) => {
  const { userPackage } = useAuth();
  const [uplines, setUplines] = useState([]);
  const axiosSecure = useAxiosSecure();
  // console.log("upline tree data: ", uplines);
  // console.log("userPackage data: ", userPackage);
  useEffect(() => {
    if (referralTree?.length > 0) {
      axiosSecure
        .post("/users/referral-tree", {
          ids: referralTree,
        })
        .then((res) => setUplines(res.data))
        .catch((err) => console.error("Failed to load tree", err));
    }
  }, [axiosSecure, referralTree]);

  return (
    <div className="max-h-[400px] overflow-y-auto bg-white shadow rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">🌳 Upline Tree</h3>

      {uplines.length === 0 ? (
        <p className="text-gray-500">
          No upline (you registered without a referral).
        </p>
      ) : (
        <ul className="space-y-3 ">
          {[...uplines].reverse().map((upline, index) => (
            <li
              key={upline?._id || index}
              className="border border-gray-200 p-3 rounded  flex justify-between items-center shadow-lg shadow-gray-400 hover:shadow-none"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Level {index + 1}
                </p>
                <p className="text-sm text-gray-600">{upline?.name || "N/A"}</p>
                <p className="text-xs text-gray-500">
                  {upline?.email || "Unknown"}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {upline?._id || "Deleted"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReferralTree;
