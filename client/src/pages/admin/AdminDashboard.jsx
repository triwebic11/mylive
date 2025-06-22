import React, { useState } from "react";
import {
    Menu,
    X,
    Users,
    Layers,
    DollarSign,
    Star,
} from "lucide-react"; // install: npm i lucide-react
import { logo } from "../../assets";


const navLinks = [
    { title: "Dashboard", icon: Layers },
    { title: "User Management", icon: Users },
    { title: "Booking Management", icon: Layers },
    { title: "Financials", icon: DollarSign },
    { title: "Notifications", icon: Star },
];

export default function AdminDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex p-2">
            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
            >
                <div className="">
                    <img src={logo} alt="" className="w-24" />
                </div>
                <nav className="p-4 space-y-1">
                    {navLinks.map(({ title, icon: Icon }) => (
                        <button
                            key={title}
                            className={`group flex items-center w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-50
                ${title === "User Management" ? "bg-emerald-100 text-emerald-700" : "text-gray-700"}`}
                        >
                            <Icon className="w-4 h-4 mr-3 text-gray-500 group-hover:text-emerald-700" />
                            {title}
                        </button>
                    ))}
                </nav>

                {/* user avatar bottom */}
                <div className="absolute bottom-4 left-0 w-full px-4">
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <img
                            src="https://i.pravatar.cc/36?img=12"
                            alt="avatar"
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="text-sm">
                            <p className="font-medium leading-none">Barakatullah</p>
                            <p className="text-gray-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ===== Main content ===== */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Topbar */}
                <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm md:hidden">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                </header>


            </div>
        </div>
    );
}

