import React from "react";
import logo from "../assets/logo.png"
import { googlePlay, appStore, paymentMethod } from "../assets";
import {
    FaFacebookF,
    FaYoutube,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-100 mt-60 text-center md:text-left text-sm text-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Us */}
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">ABOUT US</p>
                    <img
                        src={logo}
                        alt="Liveon Logo"
                        className="w-32 mb-2"
                    />
                    <p className="font-bold text-gray-800 text-sm text-center md:text-left">
                        Liveon Manufacturing & Marketing LTD.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">QUICK LINKS</p>
                    <ul className="space-y-1">
                        <Link to="/">Home</Link>
                        <Link to="/">Products</Link>
                        <Link to="/">Services</Link>
                        <Link to="/">Contact Us</Link>
                    </ul>
                </div>

                {/* Contact */}
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">CONTACT</p>
                    <p>Website: www.liveonproducts.com</p>
                    <p>Email: info@liveonproducts.com</p>
                    <p>Customer Service: 01988304840</p>
                    <p>
                        Address: SF Tower (5th Floor), Block-L,<br />
                        Road-10, House-40, South Banasree,<br />
                        Khilgaon, Dhaka-1219, Dhaka
                    </p>
                </div>

                {/* Social & Payment */}
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">FOLLOW US</p>
                    <div className="flex space-x-3 text-xl mb-4 cursor-pointer text-blue-700">
                        <Link to="#"><FaFacebookF /></Link>
                        <Link to="#"><FaYoutube /></Link>
                        <Link to="#"><FaInstagram /></Link>
                        <Link to="#"><FaTwitter /></Link>
                        <Link to="#"><FaLinkedinIn /></Link>




                    </div>

                    <p className="font-semibold text-blue-700 mb-2">PAYMENT METHODS</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                        <img src={paymentMethod} alt="visa" className="h-6" />
                        {/* <img src="/mastercard.png" alt="mastercard" className="h-6" />
                        <img src="/discover.png" alt="discover" className="h-6" />
                        <img src="/amex.png" alt="amex" className="h-6" />
                        <img src="/rocket.png" alt="rocket" className="h-6" />
                        <img src="/nagad.png" alt="nagad" className="h-6" /> */}
                    </div>

                    <p className="font-semibold text-blue-700 mb-2">INSTALL APP</p>
                    <div className="flex space-x-3">
                        <img src={googlePlay} alt="Google Play" className="h-8" />
                        <img src={appStore} alt="App Store" className="h-8" />
                    </div>
                </div>
            </div>
            <div className="bg-blue-800 text-white text-center py-3 text-sm">
                Copyright © 2025, Liveon Manufacturing & Marketing LTD
            </div>
        </footer>
    );
}

export default Footer;
