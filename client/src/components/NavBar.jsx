import { useState } from "react";
import { FaUser, FaSignInAlt, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

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
    const [openSubmenu, setOpenSubmenu] = useState(null); // for mobile submenu toggle

    const toggleSubmenu = (label) => {
        setOpenSubmenu(prev => (prev === label ? null : label));
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">
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

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <Link to="/login">Login</Link>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <Link to="/register">Join Us</Link>
                        </button>
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
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <Link to="/login">Login</Link>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <Link to="/register">Join Us</Link>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
