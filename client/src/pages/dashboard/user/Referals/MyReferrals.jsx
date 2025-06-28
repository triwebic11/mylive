import React from "react";
import MyReferral from "../../../../components/MyReferral";
const MyReferrals = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = storedUser?.user || {};
  return (
    <div>
      <MyReferral referralCode={user?.referralCode} />
    </div>
  );
};

export default MyReferrals;
