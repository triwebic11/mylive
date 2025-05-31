import { useContext, useState } from "react";
import { FaUser, FaSignInAlt, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

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
  { label: "Why Liveon", path: "/why-liveon" },
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
  { label: "DSP Login", path: "/dsp-login" },
  { label: "DSP Branches", path: "/" },
];

function NavBar() {
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // for mobile submenu toggle

  const { user, setUser } = useContext(AuthContext);
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
    <nav className="bg-white shadow-md">
      <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Link to={"/"}>
            <img src={logo} alt="Liveon" className="h-14" />
          </Link>
          <p className="font-semibold pl-2 md:text-2xl">SHS Lira Enterprise Ltd</p>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative hover:text-blue-600 cursor-pointer"
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
                  {item.label}
                  {(item.label === "About" && isAboutOpen) ||
                  (item.label === "Products" && isProductsOpen) ? (
                    <ul className="absolute top-6 left-0 w-64 bg-white border rounded shadow-md z-50">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="px-4 py-2 hover:bg-gray-100">
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
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-1 hover:text-blue-600">
                <FaUser />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-1 hover:text-blue-600">
                <FaSignInAlt />
                <span>Join Us</span>
              </Link>
            </>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-red-600 p-2 rounded-sm"
          >
            <FaBars className="text-white text-lg" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-gray-50 space-y-2 text-sm font-medium">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <>
                  <div
                    className="font-semibold mt-2 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSubmenu(item.label)}
                  >
                    <span>{item.label}</span>
                    <span>{openSubmenu === item.label ? "▲" : "▼"}</span>
                  </div>
                  {openSubmenu === item.label && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="hover:text-blue-600">
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div className="hover:text-blue-600">
                  <Link to={item.path}>{item.label}</Link>
                </div>
              )}
            </div>
          ))}

          {/* Mobile Auth */}
          <div className="flex flex-col space-y-2 pt-3">
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="text-left hover:text-blue-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 hover:text-blue-600">
                  <FaUser />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 hover:text-blue-600">
                  <FaSignInAlt />
                  <span>Join Us</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
