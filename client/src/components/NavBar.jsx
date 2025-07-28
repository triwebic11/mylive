import { useState } from "react";
import { FaUser, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const menuItems = [
  { label: "Home", path: "/" },
  {
    label: "About",
    subItems: [
      { label: "About Us", path: "/about-us" },
      { label: "Management", path: "/management" },
      { label: "Core Value", path: "/core-value" },
    ],
  },
  {
    label: "Products",
    subItems: [
      { label: "Health Care Products", path: "/" },
      { label: "Personal Care Products", path: "/" },
      { label: "Oral Care Products", path: "/" },
      { label: "Home Care Products", path: "/" },
      { label: "Agriculture Care Products", path: "/" },
    ],
  },
  { label: "Business", path: "/" },
  { label: "Gallery", path: "/" },
  { label: "Career", path: "/" },
  { label: "DSP Login", path: "/login" },
  { label: "DSP Branches", path: "/" },
];

function NavBar() {
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { role, isLoading } = useRole()

  // console.log("rooooooooooooole", role)

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const toggleSubmenu = (label) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

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
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-[1450px] mx-auto my-0 px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2">
          <img src={logo} alt="SHS Lira" className="h-28" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-sm font-medium items-center">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative group cursor-pointer hover:text-blue-600"
              onMouseEnter={() => {
                if (item.label === "About") setAboutOpen(true);
                if (item.label === "Products") setProductsOpen(true);
              }}
              onMouseLeave={() => {
                if (item.label === "About") setAboutOpen(false);
                if (item.label === "Products") setProductsOpen(false);
              }}
            >
              {item.subItems ? (
                <>
                  <span className="flex items-center gap-1 select-none">
                    {item.label}
                    <span className="transform transition-transform duration-300 group-hover:rotate-180">
                      ▼
                    </span>
                  </span>
                  {(item.label === "About" && isAboutOpen) ||
                    (item.label === "Products" && isProductsOpen) ? (
                    <ul className="absolute top-full left-0 mt-0 bg-white border rounded shadow-lg z-50 w-56 transition-all duration-300 ease-in-out opacity-100 translate-y-0">
                      {item.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="px-4 py-2 hover:bg-gray-100 transition"
                        >
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </li>
          ))}

          {/* Auth Buttons */}
          {user ? (
            <>
               <Link
                to={role === "admin" ? "/dashboard/leaderboardAdmin" : "/dashboard/leaderboard"}
                className="block py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {role === "admin" ? "Dashboard" : "Dashboard"}
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaUser />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <FaSignInAlt />
                <span>Join Us</span>
              </Link>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white bg-blue-600 p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/10 z-40 transition-opacity duration-300 ${isMobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 right-0 w-[80%] max-h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 px-4 py-3 space-y-2 text-sm font-medium z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ scrollbarWidth: "thin" }}
      >
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <>
                <div
                  className="flex justify-between items-center font-semibold cursor-pointer py-1 select-none"
                  onClick={() => toggleSubmenu(item.label)}
                >
                  <span>{item.label}</span>
                  <span>{openSubmenu === item.label ? "▲" : "▼"}</span>
                </div>
                {openSubmenu === item.label && (
                  <ul className="ml-4 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="hover:text-blue-600 text-sm">
                        <Link
                          to={subItem.path}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className="block hover:text-blue-600 py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}

        {/* Mobile Auth */}
        <div className="pt-3 border-t mt-2">
          {user ? (
            <>

              <Link
                to={role === "admin" ? "/dashboard/leaderboardAdmin" : "/dashboard/leaderboard"}
                className="block py-1 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {role === "admin" ? "Dashboard" : "userDashboard"}
              </Link>


              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block text-left py-1 text-sm hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 py-1 text-sm hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 py-1 text-sm hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaSignInAlt />
                <span>Join Us</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
