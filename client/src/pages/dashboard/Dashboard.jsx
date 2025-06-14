import { Link, Outlet, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CiHome } from "react-icons/ci";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { IoChevronDown, IoChevronUp } from "react-icons/io5"; // icons for dropdown toggle

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
      { title: "Refer Link", icon: "", link: "/dashboard/refer-link" },
      { title: "My Team", icon: "", link: "/myteam" },
      { title: "My Refer", icon: "", link: "/dashboard/my-refer" },
      { title: "Register", icon: "", link: "/register" },
    ],
  },
  {
    title: "Wallet Statement",
    icon: "",
    submenu: [{ title: "Transactions", link: "/transactions" }],
  },
  { title: "Today Statement", icon: "", link: "/dashboard/todaystatement" },
  { title: "C-Statement", icon: "", link: "/dashboard" },
  { title: "My Consistency", icon: "", link: "/dashboard" },
  { title: "Voucher", icon: "", link: "/dashboard" },
  { title: "Withdraw", icon: "", link: "/dashboard" },
  { title: "My Order", icon: "", link: "/dashboard" },
  { title: "Package Update", icon: "", link: "/dashboard/fontDashboard" },
  { title: "Support", icon: "", link: "/dashboard" },
  { title: "Kyc", icon: "", link: "/dashboard" },
  { title: "Update Password", icon: "", link: "/dashboard/profile" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="mx-6 max-h-screen">
      <div className="flex gap-2">
        <div className="md:w-[20%] flex flex-col gap-2">
          <div>
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32" />
            </Link>
          </div>
          {dashboardArry?.map((item, index) => (
            <div key={index} className="bg-blue-100 rounded-lg">
              <div
                className={`flex items-center justify-between px-3 py-2 font-bold text-lg hover:bg-gray-200 duration-300 rounded-lg cursor-pointer`}
                onClick={() =>
                  item.submenu ? toggleDropdown(index) : navigate(item.link)
                }
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.link ? (
                    <Link to={item.link}>{item.title}</Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
                {item.submenu && (
                  <span>
                    {openDropdown === index ? (
                      <IoChevronUp size={20} />
                    ) : (
                      <IoChevronDown size={20} />
                    )}
                  </span>
                )}
              </div>
              {item.submenu && openDropdown === index && (
                <ul className="ml-4 flex flex-col gap-1 py-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-base hover:bg-gray-200 duration-300 rounded-lg px-2 py-1"
                    >
                      <Link to={subItem.link}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div
            onClick={handleLogout}
            className="bg-blue-100 px-2 font-bold cursor-pointer py-2 rounded-lg hover:bg-gray-200 duration-300"
          >
            Logout
          </div>
        </div>
        <div className="md:w-[80%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
