import React from "react";
import OrderCreate from "../../../components/OrderCreate";
import useAuth from "../../../Hooks/useAuth";
const CreateUserOrder = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.user?._id;
  // console.log("User ID:", userId);
  return (
    <div>
      <OrderCreate title="Create Order For User" userId={userId} />
    </div>
  );
};

export default CreateUserOrder;
