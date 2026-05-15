"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header({ userEmail }) {

    const router = useRouter();

    const [currentTime, setCurrentTime] = useState("");

    const [greeting, setGreeting] = useState("");

    // EXTRACT USER NAME
    const userName = userEmail
        ? userEmail.split("@")[0]
        : "Investor";

    useEffect(() => {

        const updateDateTime = () => {

            const now = new Date();

            // TIME
            setCurrentTime(
                now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

            // GREETING
            const hour = now.getHours();

            if (hour < 12) {
                setGreeting("Good Morning");
            } else if (hour < 18) {
                setGreeting("Good Afternoon");
            } else {
                setGreeting("Good Evening");
            }
        };

        updateDateTime();

        const interval =
            setInterval(updateDateTime, 1000);

        return () =>
            clearInterval(interval);

    }, []);

    // // LOGOUT
    // const handleLogout = () => {

    //     localStorage.removeItem("token");

    //     localStorage.removeItem("userEmail");

    //     document.cookie =
    //         "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    //     router.push("/login");
    // };

    return (

        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-40">

            {/* LEFT */}
            <div>

                {/* GREETING */}
                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg text-lg">

                        👋
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">

                            {greeting},
                            <span className="text-violet-600 ml-2">
                                {userName}
                            </span>
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">

                            Welcome to your KFin wealth management dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">

                {/* TIME CARD */}
                <div className="hidden md:flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">

                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-lg">

                        ⏰
                    </div>

                    <div>

                        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                            Current Time
                        </p>

                        <h3 className="font-bold text-gray-900">
                            {currentTime}
                        </h3>
                    </div>
                </div>

                {/* PROFILE */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-2xl px-5 py-3 shadow-lg">

                    {/* AVATAR */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">

                        {userName.charAt(0).toUpperCase()}
                    </div>

                    {/* INFO */}
                    <div className="hidden md:block">

                        <h3 className="text-sm font-semibold text-white">
                            {userName}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                            Premium Investor
                        </p>
                    </div>

                    {/* LOGOUT
                    <button
                        onClick={handleLogout}
                        className="ml-2 bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                        Logout
                    </button> */}
                </div>
            </div>
        </header>
    );
}