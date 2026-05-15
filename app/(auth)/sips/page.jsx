"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/sidebar";
import Header from "../../components/dashboard/Header";

export default function SIPs() {
    const router = useRouter();
    const [sips, setSips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState("");
    const [totalInvested, setTotalInvested] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const email = localStorage.getItem("userEmail") || "john.doe@gmail.com";
        setUserEmail(email);

        fetchAllSIPs();
    }, []);

    async function fetchAllSIPs() {
        try {
            const token = localStorage.getItem("token");
            const cleanToken = token.replace(/["']/g, '').trim();

            const response = await fetch("http://localhost:4000/api/sips", {
                headers: {
                    "Authorization": `Bearer ${cleanToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("SIPs data:", data);

                let sipsData = Array.isArray(data) ? data : [];
                setSips(sipsData);

                if (sipsData.length === 0) {
                    setError("No SIP investments found. Start a new SIP to begin!");
                } else {
                    await calculateTotalInvested(sipsData, cleanToken);
                }
            } else {
                setError("Failed to load SIP data");
            }
        } catch (error) {
            console.error("Error fetching SIPs:", error);
            setError("Could not connect to backend");
        } finally {
            setLoading(false);
        }
    }

    async function calculateTotalInvested(sipsList, token) {
        let total = 0;

        for (const sip of sipsList) {
            try {
                const response = await fetch(`http://localhost:4000/api/sips/${sip.sip_id}/transactions`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const transactions = await response.json();
                    const sipTotal = transactions.reduce((sum, t) => sum + (t.transaction_amount || 0), 0);
                    total += sipTotal;
                }
            } catch (err) {
                console.error(`Error fetching transactions for SIP ${sip.sip_id}:`, err);
            }
        }

        setTotalInvested(total);
    }

    const totalMonthlyInvestment = sips.reduce((sum, sip) => {
        const amount = parseFloat(sip.sip_amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eccef3] flex">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header userEmail={userEmail} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-xl">Loading SIPs...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <Header userEmail={userEmail} />

                {/* PAGE */}
                <main className="flex-1 p-8 overflow-y-auto">

                    {/* TOP SECTION */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

                        <div>

                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                SIP Portfolio
                            </h1>

                            <p className="text-gray-500 mt-2 text-lg">
                                Track and manage your recurring investments
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/funds")}
                            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium shadow-sm transition-all hover:scale-[1.02]"
                        >
                            + Start New SIP
                        </button>
                    </div>

                    {/* ERROR */}
                    {error && (

                        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-5 py-4">
                            {error}
                        </div>
                    )}

                    {/* STATS */}
                    {sips.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            {/* CARD 1 */}
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm text-gray-500 font-medium">
                                            Monthly Investment
                                        </p>

                                        <h2 className="text-3xl font-bold text-gray-900 mt-4">
                                            ₹{totalMonthlyInvestment.toLocaleString()}
                                        </h2>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                                        💳
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2 */}
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm text-gray-500 font-medium">
                                            Active SIPs
                                        </p>

                                        <h2 className="text-3xl font-bold text-gray-900 mt-4">
                                            {sips.length}
                                        </h2>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                                        📈
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3 */}
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm text-gray-500 font-medium">
                                            Total Invested
                                        </p>

                                        <h2 className="text-3xl font-bold text-gray-900 mt-4">
                                            ₹{totalInvested.toLocaleString()}
                                        </h2>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                                        🚀
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABLE SECTION */}
                    <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">

                        {/* TABLE HEADER */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Active SIPs
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Overview of your recurring mutual fund investments
                                </p>
                            </div>

                            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">

                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                                <span className="text-sm text-gray-700 font-medium">
                                    Live Portfolio
                                </span>
                            </div>
                        </div>

                        {/* EMPTY STATE */}
                        {sips.length === 0 ? (

                            <div className="py-24 text-center">

                                <div className="text-7xl mb-6">
                                    📊
                                </div>

                                <h3 className="text-3xl font-bold text-gray-900">
                                    No SIP Investments Yet
                                </h3>

                                <p className="text-gray-500 mt-4 text-lg">
                                    Start your first SIP and build long-term wealth
                                </p>

                                <button
                                    onClick={() => router.push("/funds")}
                                    className="mt-8 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all"
                                >
                                    Explore Mutual Funds
                                </button>
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Fund
                                            </th>

                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Monthly Amount
                                            </th>

                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Start Date
                                            </th>

                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                SIP Date
                                            </th>

                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {sips.map((sip) => (

                                            <tr
                                                key={sip.sip_id}
                                                className="hover:bg-gray-50 transition-all"
                                            >

                                                {/* FUND */}
                                                <td className="px-8 py-6">

                                                    <div>

                                                        <p className="font-semibold text-gray-900 text-base">
                                                            {sip.fund_name || `Fund ${sip.fund_id}`}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Mutual Fund SIP
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* AMOUNT */}
                                                <td className="px-8 py-6">

                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₹{parseFloat(
                                                            sip.sip_amount || 0
                                                        ).toLocaleString()}
                                                    </p>
                                                </td>

                                                {/* DATE */}
                                                <td className="px-8 py-6 text-gray-700">
                                                    {sip.start_date || "N/A"}
                                                </td>

                                                {/* SIP DATE */}
                                                <td className="px-8 py-6 text-gray-700">
                                                    {sip.sip_date
                                                        ? `Day ${sip.sip_date}`
                                                        : "N/A"}
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-8 py-6">

                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">

                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                                                        <span className="text-sm font-medium text-green-700">
                                                            {sip.status || "Active"}
                                                        </span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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