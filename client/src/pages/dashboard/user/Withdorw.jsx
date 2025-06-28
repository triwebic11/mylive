import React from "react";
import WithdrawForm from "../../../components/WithdrawForm";
import UserWithdrawHistory from "../../../components/UserWithdrawHistory";

const Withdorw = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id || {};
  return (
    <div>
      <WithdrawForm userId={userId} />
      <UserWithdrawHistory userId={userId} />
    </div>
  );
};

export default Withdorw;
