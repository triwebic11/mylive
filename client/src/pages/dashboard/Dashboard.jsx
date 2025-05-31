import React from "react";
import { Link, Outlet } from "react-router-dom";
import { logo } from "../../assets";

const dashboardArry = [
  { title: "Market Place", icon: "", link: "/dashboard" },
  { title: "Dashboard", icon: "", link: "/dashboard" },
  {
    title: "Cash On Delivery", icon: "", link: "/dashboard/CashonDelivery"
  },
  { title: "Profile", icon: "", link: "/dashboard" },

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
  { title: "Today Statement", icon: "", link: "/dashboard" },
  { title: "C-Statemetn", icon: "", link: "/dashboard" },
  { title: "My Consistency", icon: "", link: "/dashboard" },

  { title: "Voucher", icon: "", link: "/dashboard" },
  { title: "Withdorw", icon: "", link: "/dashboard" },
  { title: "My Order", icon: "", link: "/dashboard" },
  { title: "Package Update", icon: "", link: "/dashboard" },
  { title: "Support", icon: "", link: "/dashboard" },
  { title: "Kyc", icon: "", link: "/dashboard" },
  { title: "Securiy", icon: "", link: "/dashboard" },
  { title: "Logout", icon: "", link: "/dashboard" },
  // Super Admin

];

const Dashboard = () => {
  return (
    <div className="mx-6 max-w-[1900px] max-h-screen ">
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
      </div>

      <div className=" flex gap-2 ">
        <div>
          {dashboardArry?.map((item, index) => {
            return (
              <ul key={index} className="flex flex-col gap-6 bg-blue-100">
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
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
