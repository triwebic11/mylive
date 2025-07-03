import React from "react";
import WithdrawForm from "../../../components/WithdrawForm";
import UserWithdrawHistory from "../../../components/UserWithdrawHistory";
import BalanceConversion from "../../../components/BalanceConversion";
import useAuth from "../../../Hooks/useAuth";

const Withdorw = () => {
  const { user } = useAuth();

  const userId = user?.user?._id || {};
  return (
    <div>
      <BalanceConversion userId={userId} />
      <WithdrawForm userId={userId} />
      <UserWithdrawHistory userId={userId} />
    </div>
  );
};

export default Withdorw;
