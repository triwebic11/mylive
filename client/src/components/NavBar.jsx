import { useState } from "react";
import { FaUser, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";

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
  { label: "Packages", path: "/packages" },
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
  const [openSubmenu, setOpenSubmenu] = useState(null);

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
      <div className="max-w-[1450px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2">
          <img src={logo} alt="SHS Lira" className="h-12" />
          <span className="text-lg font-bold text-gray-700 hover:text-blue-600 transition">
            SHS Lira
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
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
                  <span className="flex items-center gap-1">
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
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
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
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white bg-blue-600 p-2 rounded-md"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-3 space-y-2 text-sm font-medium">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <>
                  <div
                    className="flex justify-between items-center font-semibold cursor-pointer py-1"
                    onClick={() => toggleSubmenu(item.label)}
                  >
                    <span>{item.label}</span>
                    <span>{openSubmenu === item.label ? "▲" : "▼"}</span>
                  </div>
                  {openSubmenu === item.label && (
                    <ul className="ml-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="hover:text-blue-600">
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.path} className="block hover:text-blue-600 py-1">
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile Auth */}
          <div className="pt-4 border-t mt-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-1">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left py-1 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 py-1 hover:text-blue-600"
                >
                  <FaUser />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 py-1 hover:text-blue-600"
                >
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
