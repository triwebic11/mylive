import React from "react";
import WithdrawForm from "../../../components/WithdrawForm";
import UserWithdrawHistory from "../../../components/UserWithdrawHistory";
import BalanceConversion from "../../../components/BalanceConversion";

const Withdorw = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id || {};
  return (
    <div>
      <BalanceConversion userId={userId} />
      <WithdrawForm userId={userId} />
      <UserWithdrawHistory userId={userId} />
    </div>
  );
};

export default Withdorw;
