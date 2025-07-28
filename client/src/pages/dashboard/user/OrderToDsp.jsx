import React from "react";
import OrderCreate from "../../../components/OrderCreate";
import useAuth from "../../../Hooks/useAuth";
const OrderToDsp = () => {
  const { user } = useAuth();

  const userId = user?.user?._id;
  // console.log("user phone is - ", userId);
  return (
    <div>
      <OrderCreate title="Order Now" userId={userId} />
    </div>
  );
};

export default OrderToDsp;
