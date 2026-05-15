"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    MdDashboard,
    MdPeople,
    MdAccountBalance,
    MdAddCircle,
    MdTrendingUp,
    MdLogout,
} from "react-icons/md";

export default function Sidebar() {

    const router = useRouter();

    // USER STATE
    const [userName, setUserName] = useState("Investor");

    useEffect(() => {

        // GET USER DATA
        const email =
            localStorage.getItem("userEmail");

        // EXTRACT NAME FROM EMAIL
        if (email) {

            const extractedName =
                email.split("@")[0];

            // CAPITALIZE FIRST LETTER
            const formattedName =
                extractedName.charAt(0).toUpperCase() +
                extractedName.slice(1);

            setUserName(formattedName);
        }

    }, []);

    const menuItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <MdDashboard />,
        },
        {
            name: "Investors",
            href: "/investor",
            icon: <MdPeople />,
        },
        {
            name: "Funds",
            href: "/funds",
            icon: <MdAccountBalance />,
        },
        {
            name: "Create Fund",
            href: "/create-fund",
            icon: <MdAddCircle />,
        },
        {
            name: "My SIPs",
            href: "/sips",
            icon: <MdTrendingUp />,
        },
    ];

    // LOGOUT
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userEmail");

        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

        router.push("/login");
    };

    return (

        <aside className="w-72 min-h-screen bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#111827] text-white flex flex-col border-r border-white/10 shadow-2xl">

            {/* LOGO */}
            <div className="px-8 py-8 border-b border-white/10">

                <div className="flex items-center gap-4">

                    {/* LOGO ICON */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg text-2xl">

                        📊
                    </div>

                    {/* LOGO TEXT */}
                    <div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            KFIN TECH
                        </h1>

                        <p className="text-sm text-gray-400 mt-1">
                            Wealth Management
                        </p>
                    </div>
                </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-5 py-8">

                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold px-4 mb-5">
                    Main Menu
                </p>

                <div className="space-y-3">

                    {menuItems.map((item) => (

                        <Link
                            key={item.name}
                            href={item.href}
                            className="group flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
                        >

                            {/* ICON */}
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">

                                {item.icon}
                            </div>

                            {/* TEXT */}
                            <div>

                                <p className="font-semibold text-white">
                                    {item.name}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    Manage {item.name.toLowerCase()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* BOTTOM SECTION */}
            <div className="p-5 border-t border-white/10">

                {/* PROFILE CARD */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5 backdrop-blur-sm">

                    <div className="flex items-center gap-4">

                        {/* AVATAR */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl font-bold shadow-lg">

                            {userName.charAt(0)}
                        </div>

                        {/* USER INFO */}
                        <div>

                            <h3 className="font-semibold text-white">
                                {userName}
                            </h3>

                            <p className="text-sm text-gray-400 mt-1">
                                Premium Investor
                            </p>
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="mt-5 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">

                        <div className="w-2 h-2 rounded-full bg-green-400"></div>

                        <span className="text-sm text-green-300 font-medium">
                            Portfolio Active
                        </span>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/20 py-4 rounded-2xl font-semibold transition-all duration-300"
                >

                    <MdLogout className="text-2xl" />

                    Logout
                </button>
            </div>
        </aside>
    );
}