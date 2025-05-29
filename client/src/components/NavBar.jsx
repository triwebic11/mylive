import { useState } from "react";
import { FaUser, FaSignInAlt, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

function NavBar() {
    const [isAbout, setAboutOpen] = useState(false);
    const [isProductsOpen, setProductsOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between">
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

                    <div className="hidden md:flex space-x-4 items-center">
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <span>Login</span>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <span>Join Us</span>
                        </button>
                    </div>
                </ul>

                {/* Hamburger Icon for Mobile */}
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
                    {["Home", "Why Liveon", "Business", "Gallery", "Career", "DSP Login", "DSP Branches"].map((item, idx) => (
                        <div key={idx} className="hover:text-blue-600 cursor-pointer">
                            {item}
                        </div>
                    ))}

                    {/* About Mobile Dropdown */}
                    <div>
                        <div className="font-semibold mt-2">About</div>
                        <ul className="ml-4 space-y-1">
                            {["About Us", "Management", "Core Value"].map((item, index) => (
                                <li key={index} className="hover:text-blue-600 cursor-pointer">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Products Mobile Dropdown */}
                    <div>
                        <div className="font-semibold mt-2">Products</div>
                        <ul className="ml-4 space-y-1">
                            {[
                                "Health Care Products",
                                "Personal Care Products",
                                "Oral Care Products",
                                "Home Care Products",
                                "Agriculture Care Products",
                            ].map((item, index) => (
                                <li key={index} className="hover:text-blue-600 cursor-pointer">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex space-x-4 pt-3">
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaUser />
                            <span>Login</span>
                        </button>
                        <button className="flex items-center cursor-pointer space-x-1 hover:text-blue-600">
                            <FaSignInAlt />
                            <span>Join Us</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
