"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/sidebar";
import Header from "../../components/dashboard/Header";

export default function Dashboard() {

    const router = useRouter();

    const [userEmail, setUserEmail] = useState("");
    const [investorId, setInvestorId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState({
        totalInvestment: 0,
        activeSips: 0,
        totalReturns: 0,
        holdings: [],
    });

    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {

            const base64Url = token.split(".")[1];

            const base64 = base64Url
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );

            const decoded = JSON.parse(jsonPayload);

            const id = decoded.investor_id || decoded.id;

            setInvestorId(id);

            setUserEmail(
                decoded.email ||
                localStorage.getItem("userEmail") ||
                "john.doe@gmail.com"
            );

        } catch (err) {

            console.error("Token decode error:", err);

            setUserEmail(
                localStorage.getItem("userEmail") ||
                "john.doe@gmail.com"
            );

            setInvestorId(10);
        }

        fetchDashboardData();

    }, []);

    async function fetchDashboardData() {

        try {

            const token = localStorage.getItem("token");

            const cleanToken = token
                .replace(/["']/g, "")
                .trim();

            const id = investorId || 10;

            // FETCH HOLDINGS
            const holdingsResponse = await fetch(
                `http://localhost:4000/api/investors/${id}/holdings`,
                {
                    headers: {
                        Authorization: `Bearer ${cleanToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let holdings = [];

            let totalInvestment = 0;

            if (holdingsResponse.ok) {

                const data = await holdingsResponse.json();

                holdings = Array.isArray(data)
                    ? data
                    : [];

                totalInvestment = holdings.reduce(
                    (sum, holding) =>
                        sum +
                        (parseFloat(
                            holding.current_value
                        ) || 0),
                    0
                );
            }

            // FETCH SIPS
            let activeSips = 0;

            let sipsResponse = await fetch(
                `http://localhost:4000/api/sips/investor/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${cleanToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (sipsResponse.ok) {

                const sips = await sipsResponse.json();

                activeSips = Array.isArray(sips)
                    ? sips.length
                    : 0;

            } else {

                sipsResponse = await fetch(
                    `http://localhost:4000/api/sips`,
                    {
                        headers: {
                            Authorization: `Bearer ${cleanToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (sipsResponse.ok) {

                    const sips = await sipsResponse.json();

                    activeSips = Array.isArray(sips)
                        ? sips.length
                        : 0;
                }
            }

            setDashboardData({
                totalInvestment,
                activeSips,
                totalReturns: 12.4,
                holdings,
            });

        } catch (error) {

            console.error(
                "Dashboard fetch error:",
                error
            );

            setError(
                "Could not fetch dashboard data. Please ensure backend server is running."
            );

        } finally {

            setLoading(false);
        }
    }

    // LOADING SCREEN
    if (loading) {

        return (

            <div className="min-h-screen bg-[#f5f7fb] flex">

                <Sidebar />

                <div className="flex-1 flex flex-col">

                    <Header userEmail={userEmail} />

                    <div className="flex-1 flex items-center justify-center">

                        <div className="bg-white px-8 py-6 rounded-3xl shadow-sm border border-gray-100">

                            <div className="flex items-center gap-4">

                                <div className="w-5 h-5 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>

                                <p className="text-lg font-medium text-gray-700">
                                    Loading dashboard...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#f5f7fb] flex">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <Header userEmail={userEmail} />

                {/* PAGE CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">

                    {/* TITLE */}
                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Investment Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Track your SIPs, portfolio and wealth growth
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 flex items-center justify-between">

                            <span>{error}</span>

                            <button
                                onClick={() =>
                                    window.location.reload()
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                        {/* TOTAL INVESTMENT */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Investment
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-3">
                                        ₹{dashboardData.totalInvestment.toLocaleString()}
                                    </h2>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                                    💰
                                </div>
                            </div>
                        </div>

                        {/* ACTIVE SIPS */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Active SIPs
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-3">
                                        {dashboardData.activeSips}
                                    </h2>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                                    📈
                                </div>
                            </div>
                        </div>

                        {/* RETURNS */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Portfolio Returns
                                    </p>

                                    <h2 className="text-3xl font-bold text-green-600 mt-3">
                                        {dashboardData.totalReturns}%
                                    </h2>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                                    🚀
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOLDINGS */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* TOP */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Investment Holdings
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Overview of your current investments
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    router.push("/funds")
                                }
                                className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition"
                            >
                                Explore Funds
                            </button>
                        </div>

                        {/* EMPTY STATE */}
                        {dashboardData.holdings.length === 0 ? (

                            <div className="py-20 text-center">

                                <div className="text-6xl mb-4">
                                    📊
                                </div>

                                <h3 className="text-2xl font-semibold text-gray-800">
                                    No Investments Yet
                                </h3>

                                <p className="text-gray-500 mt-3">
                                    Start your first SIP and build long-term wealth
                                </p>

                                <button
                                    onClick={() =>
                                        router.push("/funds")
                                    }
                                    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
                                >
                                    Start Investing
                                </button>
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b border-gray-100">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Fund Name
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Units
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Current Value
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {dashboardData.holdings.map(
                                            (
                                                holding,
                                                index
                                            ) => (

                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50 transition"
                                                >

                                                    <td className="px-6 py-5">

                                                        <div>

                                                            <p className="font-semibold text-gray-900">
                                                                {holding.fund_name}
                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Mutual Fund
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 text-gray-700 font-medium">

                                                        {
                                                            holding.total_units
                                                                ? parseFloat(
                                                                    holding.total_units
                                                                ).toFixed(
                                                                    2
                                                                )
                                                                : "0"
                                                        }
                                                    </td>

                                                    <td className="px-6 py-5 text-lg font-bold text-gray-900">

                                                        ₹
                                                        {
                                                            holding.current_value
                                                                ? parseFloat(
                                                                    holding.current_value
                                                                ).toLocaleString()
                                                                : "0"
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}