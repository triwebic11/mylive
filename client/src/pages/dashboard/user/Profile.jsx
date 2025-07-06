import React from "react";
// import useAuth from "../../../Hooks/useAuth";
import UpdatePassword from "../../../components/UpdatePassword";
import MobAndBankInfoForm from "../../../components/UpdateBanAndMobInfo";
import UpdateProfileInfo from "../../../components/UpdateProfile";
import useAuth from "../../../Hooks/useAuth";
import ReferralLevelBadge from "../../../components/ReferralLevelBadge";
import KycDisplay from "../../../components/KycDisplay";
const Profile = () => {
  const { user, setUser } = useAuth();
  const userId = user?.user?._id || ""; // Ensure userId is defined, fallback to empty string
  console.log("User data from useAuth: ", user);
  // Extract user data from useAuth, fallback to empty object
  // Ensure user is defined, fallback to empty object
  console.log("User data from useAuth: ", user);

  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <ReferralLevelBadge userId={userId} />
      
      <div className="w-full bg-white ml-4 mt-4 p-4 rounded-lg shadow-md">
        <div>
          <h1 className="font-bold">Profile Information</h1>
          <p>Update your account's profile information and email address.</p>
        </div>
        <UpdateProfileInfo user={user} />

        <div className="mt-8">
          <MobAndBankInfoForm user={user} />
          <UpdatePassword user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
