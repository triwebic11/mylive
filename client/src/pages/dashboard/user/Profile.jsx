import React from "react";
import useAuth from "../../../Hooks/useAuth";
import UpdatePassword from "../../../components/PassWordUpdate";
import MobAndBankInfoForm from "../../../components/UpdateBanAndMobInfo";

const Profile = () => {
  const { user: users } = useAuth();
  const { user } = users || {};
  console.log("User data: ", user);
  // console.log("User information: ", users);

  if (!users) {
    return <div className="p-4">Loading...</div>;
  }

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
        <div className="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div>
            <span>Name</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg ">
              {user?.name}
            </div>
          </div>
          <div>
            <span>Phone</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              {user?.phone}
            </div>
          </div>
          <div>
            <span>Email</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              {user?.email}
            </div>
          </div>
          <div>
            <span>Refer Name</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your refer name
            </div>
          </div>
          <div>
            <span>Placement</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Placement name
            </div>
          </div>
          <div>
            <span>Address</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              {user.address || "You didn't add your address yet"}
            </div>
          </div>
          <div>
            <span>Image</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg cursor-pointer">
              <input type="file" className="w-full" />
            </div>
          </div>
          <div>
            <span>Nominee Name</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your nominee name
            </div>
          </div>
          <div>
            <span>Nominee Relation</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Nominee Relation
            </div>
          </div>
          <div>
            <span>Nominee Date Of Birth</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Nominee Date Of Birth
            </div>
          </div>
          <div>
            <span>Nominee Phone</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Nominee Phone
            </div>
          </div>
          <br />
          <div>
            <button className="px-4 py-1 border rounded-xl cursor-pointer hover:bg-gray-100 duration-300">
              Update
            </button>
          </div>
        </div>
        <div className="mt-8">
          <MobAndBankInfoForm />
        </div>
        <UpdatePassword />
      </div>
    </div>
  );
};

export default Profile;
