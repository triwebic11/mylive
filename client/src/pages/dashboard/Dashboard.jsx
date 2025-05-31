import React from "react";
import { Link } from "react-router-dom";
import { logo } from "../../assets";

const dashboardArry = [
  { title: "Market Place", icon: "", link: "/" },
  { title: "Dashboard", icon: "", link: "/" },
  { title: "Profile", icon: "", link: "/" },
  {
    title: "Referrals",
    icon: "",
    submenu: [
      { title: "Refer Link", icon: "", link: "/referlink" },
      { title: "My Team", icon: "", link: "/myteam" },
      { title: "My Refer", icon: "", link: "/myrefer" },
      { title: "Register", icon: "", link: "/register" },
    ],
  },
  {
    title: "Wallet Statement",
    icon: "",
    submenu: [{ title: "Transactions", link: "/transactions" }],
  },
  { title: "Today Statement", icon: "", link: "/" },
  { title: "C-Statemetn", icon: "", link: "/" },
  { title: "My Consistency", icon: "", link: "/" },

  { title: "Voucher", icon: "", link: "/" },
  { title: "Withdorw", icon: "", link: "/" },
  { title: "My Order", icon: "", link: "/" },
  { title: "Package Update", icon: "", link: "/" },
  { title: "Support", icon: "", link: "/" },
  { title: "Kyc", icon: "", link: "/" },
  { title: "Securiy", icon: "", link: "/" },
  { title: "Logout", icon: "", link: "/" },
];

const Dashboard = () => {
  return (
    <div className="mx-6 max-w-[1900px] max-h-screen ">
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>
      <div className="flex gap-4 ">
        <div>
          {dashboardArry?.map((item, index) => {
            return (
              <ul key={index} className="flex flex-col gap-6">
                <li className="flex  items-center gap-6 rounded-lg font-bold text-lg hover:bg-gray-200 duration-300 ">
                  <span>{item.icon}</span>
                  <Link to={item.link} className="py-3 px-2 ">
                    {item.title}
                  </Link>
                </li>
              </ul>
            );
          })}
        </div>
        <div>Right</div>
      </div>
    </div>
  );
};

export default Dashboard;
