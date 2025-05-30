import { useContext, useState } from "react";
import { FaUser, FaSignInAlt, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

const menuItems = [
    { label: "Home", path: "/" },
    {
        label: "About", path: "/about-us",
        subItems: [
            { label: "About Us", path: "/about-us" },
            { label: "Management", path: "/management" },
            { label: "Core Value", path: "/core-value" },
        ]
    },
    { label: "Why Liveon", path: "/why-liveon" },
    {
        label: "Products", path: "/",
        subItems: [
            { label: "Health Care Products", path: "/" },
            { label: "Personal Care Products", path: "/" },
            { label: "Oral Care Products", path: "/" },
            { label: "Home Care Products", path: "/" },
            { label: "Agriculture Care Products", path: "/" },
        ]
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
<<<<<<< HEAD
    const [openSubmenu, setOpenSubmenu] = useState(null); // for mobile submenu toggle

    const toggleSubmenu = (label) => {
        setOpenSubmenu(prev => (prev === label ? null : label));
    };
=======
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handlelogout = () => {

        localStorage.removeItem("user");
        setUser(null);
        Swal.fire({
            icon: "success",
            title: "Logged out",
            text: "You have been successfully logged out!",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
        });
        navigate("/")


    }
    // console.log(user.length)
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7

    return (
        <nav className="bg-white  shadow-md">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">
<<<<<<< HEAD
                <Link to={"/"}>
                    <img src={logo} alt="Liveon" className="h-8" />
                </Link>

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
=======
                {/* Logo */}
                <div className="flex items-center">
                    <Link to={"/"}><img src={logo} alt="Liveon" className="h-14"></img></Link>
                    <p className="font-semibold pl-2 md:text-2xl">SHS Lira Enterprise Ltd</p>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
                    <li className="hover:text-blue-600 cursor-pointer">Home</li>

                    {/* About dropdown */}
                    <li
                        className="relative hover:text-blue-600 cursor-pointer "
                        onMouseEnter={() => setAboutOpen(true)}
                        onMouseLeave={() => setAboutOpen(false)}
                    >
                        About
                        {isAbout && (
                            <ul className="absolute top-8 left-0 w-56 bg-white border rounded shadow-md z-10">
                                {["About Us", "Management", "Core Value"].map((item, index) => (
                                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li className="hover:text-blue-600 cursor-pointer">Why SHS</li>

                    {/* Products dropdown */}
                    <li
                        className="relative hover:text-blue-600 cursor-pointer"
                        onMouseEnter={() => setProductsOpen(true)}
                        onMouseLeave={() => setProductsOpen(false)}
                    >
                        Products
                        {isProductsOpen && (
                            <ul className="absolute top-8 left-0 w-64 bg-white border rounded shadow-md z-10">
                                {[
                                    "Health Care Products",
                                    "Personal Care Products",
                                    "Oral Care Products",
                                    "Home Care Products",
                                    "Agriculture Care Products",
                                ].map((item, index) => (
                                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li className="hover:text-blue-600 cursor-pointer">Business</li>
                    <li className="hover:text-blue-600 cursor-pointer">Gallery</li>
                    <li className="hover:text-blue-600 cursor-pointer">Career</li>
                    <li className="hover:text-blue-600 cursor-pointer">DSP Login</li>
                    <li className="hover:text-blue-600 cursor-pointer">DSP Branches</li>
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex space-x-4 items-center">
<<<<<<< HEAD
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <Link to="/login">Login</Link>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <Link to="/register">Join Us</Link>
                        </button>
=======
                        {
                            user ? <>
                                <Link to="/dashboard">Dashboard</Link>
                                <Link onClick={handlelogout}> Logout</Link>

                            </> : <>
                                <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                                    <FaUser />
                                    <Link to="/login">Login</Link>
                                </button>
                                <Link to="/register" className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                                    <FaSignInAlt />
                                    <p>Join Us</p>
                                </Link>
                            </>
                        }
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7
                    </div>
                </ul>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="bg-red-600 p-2 rounded-sm cursor-pointer"
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

                    {/* Mobile Auth Buttons */}
                    <div className="flex space-x-4 pt-3">
<<<<<<< HEAD
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <Link to="/login">Login</Link>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <Link to="/register">Join Us</Link>
                        </button>
=======
                       {
                            user ? <>
                                <Link to="/dashboard">Dashboard</Link>
                                <Link onClick={handlelogout}> Logout</Link>

                            </> : <>
                                <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                                    <FaUser />
                                    <Link to="/login">Login</Link>
                                </button>
                                <Link to="/register" className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                                    <FaSignInAlt />
                                    <Link to="/register">Join Us</Link>
                                </Link>
                            </>
                        }
                        
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
