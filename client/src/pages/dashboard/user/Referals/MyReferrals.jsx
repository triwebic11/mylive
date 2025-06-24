import { useEffect, useState } from "react";
import axios from "axios";

const MyReferrals = ({ referralCode }) => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (referralCode) {
      axios
        .get(`http://localhost:5000/api/users/my-referrals/${referralCode}`)
        .then((res) => setReferrals(res.data))
        .catch((err) => console.error("Failed to fetch referrals", err));
    }
  }, [referralCode]);

  return (
    <div className="bg-white shadow rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">👥 My Referrals</h3>

      {referrals.length === 0 ? (
        <p className="text-gray-500">No one has used your referral code yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {referrals.map((ref) => (
            <li key={ref._id} className="py-2">
              <p className="text-sm font-medium text-gray-700">{ref.name}</p>
              <p className="text-xs text-gray-500">{ref.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReferrals;
