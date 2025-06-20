import React from "react";
import useAuth from "../../../Hooks/useAuth";

const Profile = () => {
  const { user: users } = useAuth();
  const {user} = users || {};
  console.log("User data: ", user);
  // console.log("User information: ", users);

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
              {user.name}
            </div>
          </div>
          <div>
            <span>Phone</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              {user.phone}
            </div>
          </div>
          <div>
            <span>Email</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              {user.email}
            </div>
          </div>
          <div>
            <span>Refer Name</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your name
            </div>
          </div>
          <div>
            <span>Placement</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your name
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
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
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
              Your name
            </div>
          </div>
          <div>
            <span>Nominee Date Of Birth</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your name
            </div>
          </div>
          <div>
            <span>Nominee Phone</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              Your name
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-xl font-bold">Mobile Bank Details</h1>
          <div className="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div>
              <span>Bkash No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Bkash No
              </div>
            </div>
            <div>
              <span>Nagad No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Nagad No
              </div>
            </div>
            <div>
              <span>Rocket No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Rocket No
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-xl font-bold">Bank Info</h1>
          <div className="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div>
              <span>Bkash No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Bkash No
              </div>
            </div>
            <div>
              <span>Nagad No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Nagad No
              </div>
            </div>
            <div>
              <span>Rocket No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Rocket No
              </div>
            </div>
            <div>
              <span>Branch</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Branch Name
              </div>
            </div>
            <div>
              <span>Route No</span>
              <div className="px-2 py-1 border border-gray-300 rounded-lg">
                Route No
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-xl font-bold">Update Password</h1>
          <p>
            Ensure your account is using a long, random password to stay secure.
          </p>
          <div className="my-4">
            <span>Current Password</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-2 py-1 outline-0"
              />
            </div>
          </div>
          <div className="mt-4">
            <span>New Password</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-2 py-1 outline-0"
              />
            </div>
          </div>
          <div className="mt-4">
            <span>Confirm New Password</span>
            <div className="px-2 py-1 border border-gray-300 rounded-lg">
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-2 py-1 outline-0"
              />
            </div>
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
