
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
                        alt="SHS Lira Logo"
                        className="w-28 mb-2"
                    />
                    <p className="font-bold text-gray-800 text-sm text-center md:text-left">
                        SHS Lira Enterprise LTD.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="  items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4 ">QUICK LINKS</p>
                    <ul className="flex-none text-gray-800 ">
                        <Link className=" duration-200 font-semibold hover:text-blue-800" to="/">Home</Link> <br />
                        <Link className=" duration-200 font-semibold hover:text-blue-800" to="/">Products</Link><br />
                        <Link className=" duration-200 font-semibold hover:text-blue-800" to="/">Services</Link><br />
                        <Link className=" duration-200 font-semibold hover:text-blue-800" to="/">Contact Us</Link>
                    </ul>
                </div>

                {/* Contact */}
                <div className="flex flex-col items-center text-sm md:items-start text-gray-800 font-semibold">
                    <p className="font-semibold text-blue-700 mb-4">CONTACT</p>
                    <p>Website: <Link to="https://www.shslira.com" target="blank" className="text-blue-600 hover:text-blue-800">www.shslira.com</Link> </p>
                    <p>Email: <Link to="mailto:shslira@gmail.com" className="text-blue-600 hover:text-blue-800">shslira@gmail.com</Link></p>
                    <p>Customer Service: <Link to="tel:01750873763" target="blank" className="text-blue-600 hover:text-blue-800">01750873763</Link></p>
                    <p>
                        Madrashas Road, Shubidhat, Hazipara<br />
                        Showroom/Sub Office: Vororamor, Setabganj, Dinajpur<br />

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

                    </div>

                    <p className="font-semibold text-blue-700 mb-2">INSTALL APP</p>
                    <div className="flex space-x-3">
                        <img src={googlePlay} alt="Google Play" className="h-8" />
                        <img src={appStore} alt="App Store" className="h-8" />
                    </div>
                </div>
            </div>
            <h4 className="bg-blue-800 text-white text-center py-3 text-sm">
                Copyright © 2025, SHS Lira Manufacturing & Marketing LTD
            </h4>
        </footer>
    );
}

export default Footer;
