import React from "react";
// import useAuth from "../../../Hooks/useAuth";
import UpdatePassword from "../../../components/UpdatePassword";
import MobAndBankInfoForm from "../../../components/UpdateBanAndMobInfo";
import UpdateProfileInfo from "../../../components/UpdateProfile";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = storedUser?.user || {};
  console.log("User data: ", user);
  const referralCode = storedUser?.user?.referralCode;
  console.log("your referral code is- ", referralCode);
  // console.log("User information: ", users);

  // if (!users) {
  //   return <div className="p-4">Loading...</div>;
  // }

  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <div className="w-full bg-white ml-4 mt-4 p-4 rounded-lg shadow-md">
        <div>
          <h1 className="font-bold">Profile Information</h1>
          <p>Update your account's profile information and email address.</p>
        </div>
        <UpdateProfileInfo user={user} />

        <div className="mt-8">
          <MobAndBankInfoForm />
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
};

export default Profile;
