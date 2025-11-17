import React from "react";
import useAuth from "../../../Hooks/useAuth";
import ReturnRequest from "./ReturnRequest";

const ReturnOrder = () => {
  const { user } = useAuth();
  const dspPhone = user?.user?.email || user?.user?.phone;
  console.log("DSP User in ReturnOrder:", user?.user?.email);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Return Order Page - {user?.user?.name}
      </h2>
      <ReturnRequest dspPhone={dspPhone} />
    </div>
  );
};

export default ReturnOrder;
