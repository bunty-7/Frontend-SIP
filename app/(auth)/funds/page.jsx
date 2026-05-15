"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/sidebar";
import Header from "../../components/dashboard/Header";
import StartSIPModal from "../../components/dashboard/startsip";

export default function Funds() {
    const router = useRouter();
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState("");
    const [selectedFund, setSelectedFund] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const email = localStorage.getItem("userEmail") || "";
        setUserEmail(email);

        fetchFunds();
    }, []);

    async function fetchFunds() {
        try {
            const token = localStorage.getItem("token");
            const cleanToken = token.replace(/["']/g, '').trim();

            const response = await fetch("http://localhost:4000/api/funds", {
                headers: {
                    "Authorization": `Bearer ${cleanToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Funds from backend:", data);
                setFunds(Array.isArray(data) ? data : []);
            } else {
                setError("Failed to load funds");
            }
        } catch (error) {
            console.error("Error fetching funds:", error);
            setError("Could not connect to backend");
        } finally {
            setLoading(false);
        }
    }

    function handleStartSIP(fund) {
        setSelectedFund(fund);
        setShowModal(true);
    }

    function handleModalClose() {
        setShowModal(false);
        setSelectedFund(null);
    }

    function handleSIPSuccess() {
        alert("SIP started successfully! You can view it in 'My SIPs' page.");
        // Optionally refresh data
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eccef3] flex">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header userEmail={userEmail} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-xl">Loading funds...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <Header userEmail={userEmail} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">

                    {/* PAGE TOP */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

                        <div>

                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                Mutual Funds
                            </h1>

                            <p className="text-gray-500 mt-3 text-lg">
                                Explore professionally managed investment opportunities
                            </p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">

                            <p className="text-sm text-gray-500">
                                Total Available Funds
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                {funds.length}
                            </h2>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}
                    {funds.length === 0 && !error ? (

                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm py-24 text-center">

                            <div className="text-7xl mb-6">
                                📊
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900">
                                No Funds Available
                            </h3>

                            <p className="text-gray-500 mt-4 text-lg">
                                Funds will appear here once available
                            </p>
                        </div>

                    ) : (

                        /* FUNDS GRID */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                            {funds.map((fund) => (

                                <div
                                    key={fund.fund_id}
                                    className="group bg-white border border-gray-100 rounded-[32px] p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >

                                    {/* TOP */}
                                    <div className="flex items-start justify-between mb-8">

                                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-3xl">
                                            📈
                                        </div>

                                        <div className="px-3 py-2 rounded-xl bg-green-50 border border-green-100">

                                            <span className="text-sm font-medium text-green-700">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    {/* FUND NAME */}
                                    <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                                        {fund.fund_name}
                                    </h3>

                                    {/* CATEGORY */}
                                    <div className="mt-5">

                                        <p className="text-sm text-gray-500">
                                            Fund Category
                                        </p>

                                        <div className="mt-2 inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl">

                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>

                                            <span className="text-sm font-medium text-purple-700">
                                                {fund.fund_type || "Equity Fund"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="mt-8 space-y-4">

                                        <div className="flex items-center justify-between">

                                            <span className="text-gray-500 text-sm">
                                                Risk Level
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                Moderate
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">

                                            <span className="text-gray-500 text-sm">
                                                Investment Type
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                SIP
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">

                                            <span className="text-gray-500 text-sm">
                                                Minimum Amount
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                ₹500
                                            </span>
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        onClick={() => handleStartSIP(fund)}
                                        className="mt-10 w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition-all duration-300 group-hover:shadow-lg"
                                    >
                                        Start SIP
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL */}
            {showModal && selectedFund && (
                <StartSIPModal
                    fund={selectedFund}
                    onClose={handleModalClose}
                    onSuccess={handleSIPSuccess}
                />
            )}
        </div>
    );
}