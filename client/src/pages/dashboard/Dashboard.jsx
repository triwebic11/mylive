
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CiHome } from "react-icons/ci";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const dashboardArry = [
  { title: "Market Place", icon: <MdOutlineShoppingBag />, link: "/" },
  { title: "Dashboard", icon: <CiHome />, link: "/dashboard/fontDashboard" },
  {
    title: "Cash On Delivery",
    icon: "",
    link: "/dashboard/CashonDelivery",
  },
  { title: "Profile", icon: "", link: "/dashboard/profile" },

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
  { title: "Today Statement", icon: "", link: "/dashboard/todaystatement" },
  { title: "C-Statemetn", icon: "", link: "/dashboard" },
  { title: "My Consistency", icon: "", link: "/dashboard" },

  { title: "Voucher", icon: "", link: "/dashboard" },
  { title: "Withdorw", icon: "", link: "/dashboard" },
  { title: "My Order", icon: "", link: "/dashboard" },
  { title: "Package Update", icon: "", link: "/dashboard" },
  { title: "Support", icon: "", link: "/dashboard" },
  { title: "Kyc", icon: "", link: "/dashboard" },
  { title: "Securiy", icon: "", link: "/dashboard" },

  // Super Admin
];

const Dashboard = () => {
  const navigate = useNavigate()
  const {setUser} = useContext(AuthContext)
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    Swal.fire({
      icon: "success",
      title: "Logged out",
      text: "You have been successfully logged out!",
      confirmButtonColor: "#3085d6",
    });
    navigate("/");
  };

  return (
    <div className="mx-6  max-h-screen ">


      <div className=" flex  gap-2 ">
        <div className="md:w-[20%] flex flex-col gap-2">
          <div >
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32" />
            </Link>
          </div>
          {dashboardArry?.map((item, index) => {
            return (
              <ul key={index} className="flex flex-col gap-6 bg-blue-100">
                <li className="flex  items-center gap-y-6 px-1 rounded-lg font-bold text-lg hover:bg-gray-200 duration-300 ">
                  <span>{item.icon}</span>
                  <Link to={item.link} className="py-3 px-1">
                    {item.title}
                  </Link>
                </li>
              </ul>
            );
          })}
          <div
            onClick={handleLogout}
            className="bg-blue-100 px-2 font-bold cursor-pointer py-1"
          >
            Logout
          </div>
        </div>
        <div className="md:w-[80%]">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
