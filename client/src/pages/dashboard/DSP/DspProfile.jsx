import React from "react";
import UpdateProfileInfo from "../../../components/UpdateProfile";
import useAuth from "../../../Hooks/useAuth";
import MobAndBankInfoForm from "../../../components/UpdateBanAndMobInfo";
import UpdatePassword from "../../../components/UpdatePassword";

const DspProfile = () => {
  const { user } = useAuth(); // Assuming useAuth is used to get user data
  return (
    <div>
      <UpdateProfileInfo user={user} />
      <MobAndBankInfoForm user={user} />
      <UpdatePassword user={user} />
    </div>
  );
};

export default DspProfile;
