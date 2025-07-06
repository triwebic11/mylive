import React, { useEffect, useState } from "react";
import axiosSecure from "../Hooks/useAxiosSecure"; // path ঠিক করো

const KycDisplay = ({ userId }) => {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios = axiosSecure();

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await axios.get(`/users/kyc/${userId}`);
        setKyc(res.data);
      } catch (err) {
        console.error("KYC fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchKyc();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!kyc) return <p>No KYC found.</p>;

  return (
    <div className="space-y-4 mt-6">
      <div>
        <p className="font-semibold">Front Side:</p>
        <img
          src={kyc.frontImage}
          alt="Front NID"
          className="max-h-40 rounded"
        />
      </div>
      <div>
        <p className="font-semibold">Back Side:</p>
        <img src={kyc.backImage} alt="Back NID" className="max-h-40 rounded" />
      </div>
    </div>
  );
};

export default KycDisplay;
