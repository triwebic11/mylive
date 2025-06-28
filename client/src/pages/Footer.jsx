
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
                        SHS Lira Manufacturing & Marketing LTD.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="  items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">QUICK LINKS</p>
                    <ul className="flex-none ">
                        <Link to="/">Home</Link> <br />
                        <Link to="/">Products</Link><br />
                        <Link to="/">Services</Link><br />
                        <Link to="/">Contact Us</Link>
                    </ul>
                </div>

                {/* Contact */}
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-semibold text-blue-700 mb-4">CONTACT</p>
                    <p>Website: www.shslira.com</p>
                    <p>Email: shslira@gmail.com</p>
                    <p>Customer Service: 01750873763</p>
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
                Copyright <span>©</span> 2025, SHS Lira Manufacturing & Marketing LTD
            </h4>
        </footer>
    );
}

export default Footer;
