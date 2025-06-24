import axios from "axios";
import { useEffect, useState } from "react";

const MyReferrals = ({ userId }) => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/my-referrals/${userId}`)
      .then(res => setReferrals(res.data.referrals))
      .catch(err => console.error(err));
      console.log("My referrals data: ", referrals);
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">My Referrals</h2>
      <ul className="mt-4 space-y-2">
        {referrals.map((ref, i) => (
          <li key={i} className="bg-white p-2 shadow rounded">
            <p>Generation: {ref.generation}</p>
            <p>Name: {ref.referredUser?.name}</p>
            <p>Phone: {ref.referredUser?.phone}</p>
            <p>Referral Code: {ref.referredUser?.referralCode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReferrals;
