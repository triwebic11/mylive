import React from "react";
import Packeg from "../../components/Packeg";
import PackageUpdate from "../dashboard/user/PackageUpdate";

const PackegForActive = () => {
  return (
    <div>
      <h1>Purchase a packeg to active your Account</h1>
      <Packeg tiele="platinam" />
      <Packeg tiele="gold" />
      <Packeg tiele="silver" />
      <Packeg tiele="regular" />
      <PackageUpdate />
    </div>
  );
};

export default PackegForActive;
