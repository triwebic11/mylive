import { useEffect, useState } from "react";
import axios from "axios";

const MyReferral = ({ referralCode }) => {
  const [referrals, setReferrals] = useState([]);
  console.log("Your referrals is = ", referrals);

  useEffect(() => {
    if (referralCode) {
      axios
        .get(`https://apidata.shslira.com/api/users/my-referrals/${referralCode}`)
        .then((res) => setReferrals(res.data))
        .catch((err) => console.error("Failed to fetch referrals", err));
    }
  }, [referralCode]);

  return (
    <div className="max-h-[400px] overflow-y-auto bg-white shadow rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">👥 My Referrals</h3>

      {referrals.length === 0 ? (
        <p className="text-gray-500">No one has used your referral code yet.</p>
      ) : (
        <div className="overflow-x-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  SI No
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Referred At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((ref, index) => {
                let referredAt = ref.createdAt;
                const date = new Date(referredAt);
                const formatted = date.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <tr
                    key={ref._id}
                    className="hover:bg-gray-50 hover:shadow-md transition-all"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">
                      {ref.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {ref.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {formatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReferral;
