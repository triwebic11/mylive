import React from "react";
import WithdrawForm from "../../../components/WithdrawForm";

const Withdorw = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id || {};
  return (
    <div>
      <WithdrawForm userId={userId} />
    </div>
  );
};

export default Withdorw;
