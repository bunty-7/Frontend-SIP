"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    MdOutlineEmail,
    MdOutlineLock,
} from "react-icons/md";

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleLogin() {

        if (!email || !password) {

            setError(
                "Please enter email and password"
            );

            return;
        }

        setError("");

        setIsLoading(true);

        try {

            const response = await fetch(
                "http://localhost:4000/api/investors/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {

                if (response.status === 401) {

                    setError(
                        "Invalid email or password"
                    );

                } else if (
                    response.status === 404
                ) {

                    setError(
                        "User not found"
                    );

                } else {

                    setError(
                        result.message ||
                        "Login failed"
                    );
                }

                return;
            }

            // STORE DATA
            localStorage.setItem(
                "token",
                result.token
            );

            localStorage.setItem(
                "userEmail",
                result.user?.email || email
            );

            localStorage.setItem(
                "investorId",
                result.user?.investor_id ||
                result.user?.id
            );

            // COOKIE
            document.cookie =
                `token=${result.token}; path=/; max-age=86400; SameSite=Strict`;

            router.push("/dashboard");

        } catch (error) {

            console.error(error);

            setError(
                "Backend server is not running on port 4000"
            );

        } finally {

            setIsLoading(false);
        }
    }

    function handleKeyPress(e) {

        if (e.key === "Enter") {
            handleLogin();
        }
    }

    return (

        <div className="min-h-screen bg-[#0f172a] flex overflow-hidden">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#312e81] items-center justify-center px-16">

                {/* GLOW EFFECT */}
                <div className="absolute w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl"></div>

                {/* CONTENT */}
                <div className="relative z-10 max-w-xl">

                    {/* LOGO */}
                    <div className="flex items-center gap-5 mb-10">

                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-4xl shadow-2xl">

                            📈
                        </div>

                        <div>

                            <h1 className="text-5xl font-bold text-white tracking-tight">
                                KFIN TECH
                            </h1>

                            <p className="text-violet-200 mt-2 text-lg">
                                Wealth Management Platform
                            </p>
                        </div>
                    </div>

                    {/* TEXT */}
                    <h2 className="text-6xl font-bold leading-tight text-white">

                        Smart Investing
                        <br />

                        Starts Here.
                    </h2>

                    <p className="text-gray-300 text-xl mt-8 leading-relaxed">

                        Track portfolios, manage SIPs,
                        monitor investments and build
                        long-term wealth with a premium
                        fintech experience.
                    </p>

                    {/* FEATURES */}
                    <div className="grid grid-cols-2 gap-5 mt-12">

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">

                            <h3 className="text-white font-semibold text-lg">
                                Portfolio Tracking
                            </h3>

                            <p className="text-gray-400 mt-2 text-sm">
                                Real-time investment insights
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">

                            <h3 className="text-white font-semibold text-lg">
                                SIP Analytics
                            </h3>

                            <p className="text-gray-400 mt-2 text-sm">
                                Advanced financial dashboards
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#f8fafc]">

                {/* CARD */}
                <div className="w-full max-w-md bg-white rounded-[36px] shadow-2xl border border-gray-100 overflow-hidden">

                    {/* TOP */}
                    <div className="px-10 pt-10">

                        <div className="lg:hidden flex items-center gap-4 mb-10">

                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-3xl shadow-lg">

                                📈
                            </div>

                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">
                                    KFIN TECH
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Wealth Platform
                                </p>
                            </div>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">

                            Welcome Back
                        </h2>

                        <p className="text-gray-500 mt-3 text-lg">

                            Login to continue managing your investments
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="p-10 space-y-6">

                        {/* ERROR */}
                        {error && (

                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm">
                                {error}
                            </div>
                        )}

                        {/* EMAIL */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-3">

                                Email Address
                            </label>

                            <div className="relative">

                                <MdOutlineEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={
                                        handleKeyPress
                                    }
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-3">

                                Password
                            </label>

                            <div className="relative">

                                <MdOutlineLock className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={
                                        handleKeyPress
                                    }
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50"
                        >

                            {isLoading
                                ? "Signing In..."
                                : "Login to Dashboard"}
                        </button>

                        {/* FOOTER */}
                        <div className="pt-4 text-center">

                            <p className="text-sm text-gray-500">

                                Secure fintech platform powered by
                                advanced portfolio analytics
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}