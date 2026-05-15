"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/sidebar";
import Header from "../../components/dashboard/Header";
import InputField from "../../components/dashboard/InputField";

export default function Investors() {
    const router = useRouter();
    const [investorId, setInvestorId] = useState("");
    const [investor, setInvestor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        setUserEmail(localStorage.getItem("userEmail") || "Investor");
    }, []);

    async function getInvestor() {
        if (!investorId.trim()) {
            setError("Please enter an Investor ID");
            return;
        }

        setLoading(true);
        setError("");
        setInvestor(null);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:4000/api/investors/${investorId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Session expired. Please login again");
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (response.status === 403) {
                    setError("You don't have permission to view this investor");
                } else if (response.status === 404) {
                    setError("Investor not found");
                } else {
                    setError(data.message || "Failed to fetch investor data");
                }
                return;
            }

            setInvestor(data);
        } catch (err) {
            console.error("Error fetching investor:", err);
            setError("Network error - please check if backend is running on port 4000");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <Header userEmail={userEmail} />

                {/* PAGE */}
                <main className="flex-1 p-8 overflow-y-auto">

                    {/* TOP */}
                    <div className="mb-10">

                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Investor Lookup
                        </h1>

                        <p className="text-gray-500 mt-3 text-lg">
                            Search and access investor profile information securely
                        </p>
                    </div>

                    {/* SEARCH CARD */}
                    <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm p-8 max-w-4xl">

                        {/* SEARCH TOP */}
                        <div className="flex items-center justify-between mb-8">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Search Investor
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Enter investor ID to retrieve account details
                                </p>
                            </div>

                            <div className="hidden md:flex w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 items-center justify-center text-3xl">
                                👤
                            </div>
                        </div>

                        {/* INPUT */}
                        <div className="flex flex-col md:flex-row gap-4">

                            <div className="flex-1">

                                <InputField
                                    placeholder="Enter Investor ID"
                                    type="text"
                                    value={investorId}
                                    onChange={(e) =>
                                        setInvestorId(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                onClick={getInvestor}
                                disabled={loading}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-medium transition-all hover:scale-[1.01] disabled:opacity-50"
                            >
                                {loading
                                    ? "Searching..."
                                    : "Get Investor"}
                            </button>
                        </div>

                        {/* ERROR */}
                        {error && (

                            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
                                {error}
                            </div>
                        )}

                        {/* INVESTOR CARD */}
                        {investor && (

                            <div className="mt-10 border-t border-gray-100 pt-10">

                                {/* PROFILE HEADER */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

                                    <div className="flex items-center gap-5">

                                        {/* AVATAR */}
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">

                                            {investor.full_name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "I"}
                                        </div>

                                        <div>

                                            <h3 className="text-3xl font-bold text-gray-900">
                                                {investor.full_name || "Unknown Investor"}
                                            </h3>

                                            <p className="text-gray-500 mt-1">
                                                Investor Profile Details
                                            </p>
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-50 border border-green-100">

                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                                        <span className="text-sm font-medium text-green-700">
                                            Verified Investor
                                        </span>
                                    </div>
                                </div>

                                {/* DETAILS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* EMAIL */}
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

                                        <p className="text-sm text-gray-500 mb-2">
                                            Email Address
                                        </p>

                                        <p className="text-lg font-semibold text-gray-900 break-all">
                                            {investor.email || "N/A"}
                                        </p>
                                    </div>

                                    {/* MOBILE */}
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

                                        <p className="text-sm text-gray-500 mb-2">
                                            Mobile Number
                                        </p>

                                        <p className="text-lg font-semibold text-gray-900">
                                            {investor.mobile ||
                                                investor.phone ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    {/* INVESTOR ID */}
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

                                        <p className="text-sm text-gray-500 mb-2">
                                            Investor ID
                                        </p>

                                        <p className="text-lg font-semibold text-gray-900">
                                            #{investorId}
                                        </p>
                                    </div>

                                    {/* STATUS */}
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">

                                        <p className="text-sm text-gray-500 mb-2">
                                            Account Status
                                        </p>

                                        <div className="inline-flex items-center gap-2">

                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                                            <span className="text-lg font-semibold text-green-700">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}