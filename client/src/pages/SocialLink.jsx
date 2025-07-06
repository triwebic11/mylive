import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaWhatsapp,
    FaYoutube,
    FaTwitter,
} from "react-icons/fa";

const SocialSlide = () => {
    const links = [
        {
            id: 1,
            icon: <FaFacebookF />,
            href: "https://facebook.com",
            className: "bg-[#3b5998]",
        },
        {
            id: 2,
            icon: <FaYoutube />,
            href: "https://youtube.com",
            className: "bg-[#FF0000]",
        },
        {
            id: 3,
            icon: <FaInstagram />,
            href: "https://instagram.com",
            className:
                "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600",
        },
        {
            id: 4,
            icon: <FaTwitter />,
            href: "https://twitter.com",
            className: "bg-[#1DA1F2]",
        },
        {
            id: 5,
            icon: <FaLinkedinIn />,
            href: "https://linkedin.com",
            className: "bg-[#0077B5]",
        },
        {
            id: 6,
            icon: <FaWhatsapp />,
            href: "https://whatsapp.com",
            className: "bg-[#25D366]",
        },
    ];

    return (
        <div className="fixed top-1/3 left-0 z-50">
            <ul className="space-y-0">
                {links.map(({ id, icon, href, className }) => (
                    <li
                        key={id}
                        className={`flex items-center justify-center w-12 h-10  ml-[-8px] hover:ml-0 hover:rounded-r-md cursor-pointer text-white transition-all duration-300 ease-out ${className}`}
                    >
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full flex items-center justify-center"
                        >
                            <span className="text-lg">{icon}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SocialSlide;
