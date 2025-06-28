import { Link, Outlet, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { MdOutlineShoppingBag, MdMenu } from "react-icons/md";
import { CiHome } from "react-icons/ci";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";

const dashboardArry = [
  { title: "Market Place", icon: <MdOutlineShoppingBag />, link: "/" },
  { title: "Dashboard", icon: <CiHome />, link: "/dashboard/leaderboard" },

  { title: "Profile", icon: "", link: "/dashboard/profile" },
  { title: "Packages", icon: "", link: "/dashboard/packages" },
  {
    title: "Referrals",
    icon: "",
    submenu: [
      { title: "Refer Link", icon: "", link: "/dashboard/refer-link" },
      { title: "My Team", icon: "", link: "/dashboard/my-team" },
      { title: "My Refer", icon: "", link: "/dashboard/my-refer" },
      { title: "Register", icon: "", link: "/dashboard/register" },
    ],
  },
  {
    title: "Wallet Statement",
    icon: "",
    submenu: [{ title: "Transactions", link: "/dashboard/transactions" }],
  },
  { title: "Today Statement", icon: "", link: "/dashboard/today-statement" },
  { title: "C-Statement", icon: "", link: "/dashboard/commission-statement" },
  { title: "My Consistency", icon: "", link: "/dashboard/my-consistency" },
  { title: "Voucher", icon: "", link: "/dashboard/voucher" },
  { title: "Withdraw", icon: "", link: "/dashboard/withdraw" },
  { title: "My Order", icon: "", link: "/dashboard/my-order" },
  { title: "Package Update", icon: "", link: "/dashboard/fontDashboard" },
  { title: "Support", icon: "", link: "/dashboard" },
  { title: "Kyc", icon: "", link: "/dashboard" },
  { title: "Update Password", icon: "", link: "/dashboard/update-password" },
];

const adminDashboardArry = [
  {
    title: "Cash On Delivery",
    icon: "",
    link: "/dashboard/CashonDelivery",
  },
  {
    title: "All Users",
    icon: "",
    link: "/allUsers",
  },
  {
    title: "All Withdrawal",
    icon: "",
    link: "/allWithdrawals",
  },
  {
    title: "Manage Products",
    icon: "",
    link: "/dashboard",
    submenu: [
      { title: "All Products", icon: "", link: "/dashboard/allProducts" },
      { title: "Add Products", icon: "", link: "/dashboard/AddProduct" },
    ],
  },
  {
    title: "Manage Packages",
    icon: "",
    link: "/dashboard",
    submenu: [
      { title: "All Packages", icon: "", link: "/dashboard/packages" },
      { title: "Update Packages", icon: "", link: "/dashboard/updatePackages" },
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-4 focus:outline-none fixed bg-white shadow-2xl top-0"
        onClick={handleSidebarToggle}
        aria-label="Open sidebar"
      >
        <MdMenu size={24} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden "
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white px-4 py-6 overflow-y-auto transform transition-transform duration-300 flex-shrink-0
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link to="/" onClick={closeSidebar}>
            <img src={logo} alt="Logo" className="w-32 " />
          </Link>
          {/* Close button for mobile */}
          <button
            className="md:hidden focus:outline-none"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* admin dashboard */}
        <p className="text-red-600">Admin Dashboard</p>

        <nav className="flex flex-col gap-2">
          {adminDashboardArry?.map((item, index) => (
            <div key={index} className="bg-blue-100 rounded-lg">
              <div
                className="flex items-center justify-between px-3 py-2 font-bold text-lg hover:bg-gray-200 duration-300 rounded-lg cursor-pointer"
                onClick={() =>
                  item.submenu
                    ? toggleDropdown(index)
                    : (navigate(item.link), closeSidebar())
                }
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  {item.link ? (
                    <span>{item.title}</span>
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
                      onClick={closeSidebar}
                    >
                      <Link to={subItem.link}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* <button
            onClick={handleLogout}
            className="bg-blue-100 px-2 font-bold py-2 rounded-lg hover:bg-gray-200 duration-300 mt-4"
          >
            Logout
          </button> */}
        </nav>

        <p className="text-red-600">User Dashboard</p>

        <nav className="flex flex-col gap-2">
          {dashboardArry.map((item, index) => (
            <div key={index} className="bg-blue-100 rounded-lg">
              <div
                className="flex items-center justify-between px-3 py-2 font-bold text-lg hover:bg-gray-200 duration-300 rounded-lg cursor-pointer"
                onClick={() =>
                  item.submenu
                    ? toggleDropdown(index)
                    : (navigate(item.link), closeSidebar())
                }
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  {item.link ? (
                    <span>{item.title}</span>
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
                      onClick={closeSidebar}
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
            className="bg-blue-100 px-2 font-bold py-2 rounded-lg hover:bg-gray-200 duration-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
