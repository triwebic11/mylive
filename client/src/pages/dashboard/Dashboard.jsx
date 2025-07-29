import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { MdOutlineShoppingBag, MdMenu } from "react-icons/md";
import { CiHome } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import useUserById from "../../Hooks/useUserById";
import useRole from "../../Hooks/useRole";
import useAuth from "../../Hooks/useAuth";
import { FaLink } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { HiOutlineWallet } from "react-icons/hi2";
import { PiWallDuotone } from "react-icons/pi";
import { IoCardOutline } from "react-icons/io5";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TiShoppingCart } from "react-icons/ti";
import { MdLockOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineSms } from "react-icons/md";
import { RiUserFollowLine } from "react-icons/ri";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { MdManageHistory } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";

const dashboardArry = [
  {
    title: "Market Place",
    icon: <MdOutlineShoppingBag />,
    link: "/dashboard/marketPlace",
  },
  { title: "Dashboard", icon: <CiHome />, link: "/dashboard/leaderboard" },
  { title: "Profile", icon: <CgProfile />, link: "/dashboard/profile" },
  { title: "Packages", icon: <FiPackage />, link: "/dashboard/userPackages" },
  {
    title: "Referrals",
    icon: <FaLink />,
    submenu: [
      { title: "Refer Link", link: "/dashboard/refer-link" },
      { title: "My Team", link: "/dashboard/my-team" },
      { title: "My Refer", link: "/dashboard/my-refer" },
      { title: "Register", link: "/dashboard/register" },
    ],
  },
  {
    title: "Wallet Statement",
    icon: <HiOutlineWallet />,
    submenu: [{ title: "Transactions", link: "/dashboard/transactions" }],
  },
  {
    title: "Today Statement",
    icon: <PiWallDuotone />,
    link: "/dashboard/today-statement",
  },
  {
    title: "C-Statement",
    icon: <PiWallDuotone />,
    link: "/dashboard/commission-statement",
  },
  {
    title: "My Consistency",
    icon: <PiWallDuotone />,
    link: "/dashboard/my-consistency",
  },
  { title: "Voucher", icon: <IoCardOutline />, link: "/dashboard/voucher" },
  {
    title: "Withdraw",
    icon: <HiMiniArrowsUpDown />,
    link: "/dashboard/withdraw",
  },

  { title: "My Order", icon: <TiShoppingCart />, link: "/dashboard/my-order" },
  // { title: "Package Update", link: "/dashboard" },
  { title: "Support", icon: <MdOutlineSms />, link: "/dashboard/support" },
  { title: "Kyc", icon: <IoKeyOutline />, link: "/dashboard/kyc" },
  {
    title: "Update Password",
    icon: <MdLockOutline />,
    link: "/dashboard/update-password",
  },
];

const DspDashboard = [
  { title: "Profile", icon: <CgProfile />, link: "/dashboard/dspprofile" },
  // { title: "All User's Orders", icon: <RiUserFollowLine />, link: "/dashboard/allOrders" },
  {
    title: "Order For User",
    icon: <TiShoppingCart />,
    link: "/dashboard/orderFroUser",
  },
  // { title: "Order Now", icon: <TiShoppingCart />, link: "/dashboard/dspOrder" },
  {
    title: "My Orders",
    icon: <MdDoneAll />,
    link: "/dashboard/myAprovedOrders",
  },
  // { title: "My Order", icon: <TiShoppingCart />, link: "/dashboard/myOrders" },
  {
    title: "Wallet Statement",
    icon: <HiOutlineWallet />,
    submenu: [{ title: "Transactions", link: "/dashboard/transactions" }],
  },
  {
    title: "Withdraw",
    icon: <HiMiniArrowsUpDown />,
    link: "/dashboard/withdraw",
  },
  { title: "Kyc", icon: <IoKeyOutline />, link: "/dashboard/kyc" },
];

const adminDashboardArry = [
  { title: "Dashboard", icon: <CiHome />, link: "/dashboard/leaderboardAdmin" },
  { title: "DB Storage", icon: <CiHome />, link: "/dashboard/storage" },
  { title: "Create DSP ID", icon: <CiHome />, link: "/dashboard/createDspId" },
  {
    title: "Order for DSP",
    icon: <TiShoppingCart />,
    link: "/dashboard/createOrder",
  },
  {
    title: "All Users",
    icon: <RiUserFollowLine />,
    link: "/dashboard/allUsers",
  },
  {
    title: "All DSP Orders",
    icon: <TiShoppingCart />,
    link: "/dashboard/allDspOrders",
  },
  // { title: "All Package Requester", icon: <FiPackage />, link: "/dashboard/allPackageRequestUser" },
  {
    title: "All Withdrawal",
    icon: <HiMiniArrowsUpDown />,
    link: "/dashboard/allWithdrawals",
  },
  {
    title: "Balance Conversion",
    icon: <RiMoneyDollarBoxLine />,
    link: "/dashboard/balanceConversion",
  },
  // { title: "Cash On Delivery", icon: <TiShoppingCart />, link: "/dashboard/CashonDelivery" },
  {
    title: "Manage Products",
    icon: <MdManageHistory />,
    submenu: [
      { title: "All Products", link: "/dashboard/allProducts" },
      { title: "Add Products", link: "/dashboard/AddProduct" },
    ],
  },
  {
    title: "Manage Packages",
    icon: <FiPackage />,
    submenu: [
      { title: "All Packages", link: "/dashboard/packages" },
      { title: "Update Packages", link: "/dashboard/updatePackages" },
    ],
  },
  {
    title: "Update Password",
    icon: <MdLockOutline />,
    link: "/dashboard/update-password",
  },
  {
    title: "User KYC Verified Request",
    icon: <IoKeyOutline />,
    link: "/dashboard/kycVerified",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [rightSideBar, setRightSideBar] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [data] = useUserById();
  const { role } = useRole();
  const { user } = useAuth();

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

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setSidebarOpen(false);

  // const menuArray = role === "admin" ? adminDashboardArry : dashboardArry;
  const newMenuArray =
    role === "admin"
      ? adminDashboardArry
      : role === "dsp"
      ? DspDashboard
      : dashboardArry;

  return (
    <div className="flex min-h-screen flex-col md:flex-row relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden w-full bg-white shadow-md fixed top-0 left-0 z-40 px-4 py-3 flex justify-between items-center h-16">
        <button onClick={handleSidebarToggle} aria-label="Toggle Menu">
          {sidebarOpen ? <IoClose size={24} /> : <MdMenu size={24} />}
        </button>
        {/* // Riyad Babu aikhane kaj koren// Riyad Babu aikhane kaj */}
        <div className="flex justify-end items-center gap-4 relative">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="w-24" />
          </Link>

          {/* Username Button */}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-lg bg-white hover:bg-gray-100 rounded-md transition duration-300"
          >
            {user?.user?.name}
            <span className="rotate-180 text-xl"></span>
          </button>

          {/* Dropdown Sidebar */}
          {rightSidebarOpen && (
            <div className="absolute top-16 right-0 w-28 bg-white shadow-lg z-50 p-4 rounded-md ">
              <div className="text-center text-black font-semibold hover:text-purple-700 mb-2">
                <Link to="/dashboard/profile">Profile</Link>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 font-semibold  hover:text-purple-700 rounded-md  transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* // Riyad Babu aikhane kaj koren// Riyad Babu aikhane kaj */}
      </div>

      {/* Mobile Sidebar Menu (scrollable) */}
      <div
        className={`md:hidden fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[60%] px-4 py-6 overflow-y-auto`}
      >
        <h1 className="text-center py-2 border border-amber-600 rounded-lg mb-2 shadow-xl">
          {role?.toUpperCase()} Dashboard
        </h1>
        <nav className="flex flex-col gap-2">
          {newMenuArray.map((item, index) => (
            <div key={index}>
              <div
                className="flex justify-between items-center font-semibold py-2 px-2 hover: rounded cursor-pointer"
                onClick={() =>
                  item.submenu
                    ? toggleDropdown(index)
                    : (navigate(item.link), setSidebarOpen(false))
                }
              >
                <span>{item.title}</span>
                {item.submenu && (
                  <span>
                    {openDropdown === index ? (
                      <IoChevronUp size={18} />
                    ) : (
                      <IoChevronDown size={18} />
                    )}
                  </span>
                )}
              </div>
              {item.submenu && openDropdown === index && (
                <ul className="pl-4 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-sm hover:bg-gray-200 px-2 py-1 rounded"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Link to={subItem.link}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-blue-100 px-3 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 inset-y-0 w-64 bg-white px-4 py-6 overflow-y-auto z-40 shadow">
        <Link to="/" className="block mb-6">
          <img src={logo} alt="Logo" className="w-32" />
        </Link>
        <h1 className="text-center py-2  border-blue-500 rounded-lg mb-2 shadow-md">
          {role?.toUpperCase()} Dashboard
        </h1>
        <nav className="flex flex-col gap-2">
          {newMenuArray.map((item, index) => (
            <div
              key={index}
              className="hover:border-b hover:border-b-blue-500 rounded-lg"
            >
              {item.submenu ? (
                <div
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center justify-between px-3 py-2 font-semibold text-lg duration-300 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </div>
                  <span>
                    {openDropdown === index ? (
                      <IoChevronUp size={20} />
                    ) : (
                      <IoChevronDown size={20} />
                    )}
                  </span>
                </div>
              ) : (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 font-semibold text-lg duration-300 rounded-lg cursor-pointer ${
                      isActive
                        ? "border-b-2 border-blue-500 bg-gray-100"
                        : "hover:bg-gray-200"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.title}</span>
                  </div>
                </NavLink>
              )}

              {item.submenu && openDropdown === index && (
                <ul className="ml-4 flex flex-col gap-1 py-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-base hover:border-b-2 hover:border-b-blue-500 duration-300 rounded-lg px-2 py-1"
                    >
                      <NavLink
                        to={subItem.link}
                        className={({ isActive }) =>
                          isActive ? "text-blue-500 font-semibold" : ""
                        }
                        end
                      >
                        {subItem.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="bg-blue-100 px-2 font-semibold py-2 rounded-lg hover:bg-gray-200 duration-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pt-20 md:pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
