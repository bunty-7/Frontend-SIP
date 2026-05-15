"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/sidebar";
import Header from "../../components/dashboard/Header";

export default function CreateFund() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");
    const [formData, setFormData] = useState({
        amc_id: "",
        fund_name: "",
        fund_type: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const email = localStorage.getItem("userEmail") || "";
        setUserEmail(email);
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const cleanToken = token.replace(/["']/g, '').trim();

            const response = await fetch("http://localhost:4000/api/funds", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cleanToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amc_id: parseInt(formData.amc_id),
                    fund_name: formData.fund_name,
                    fund_type: formData.fund_type
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`Fund "${formData.fund_name}" created successfully!`);
                setFormData({ amc_id: "", fund_name: "", fund_type: "" });
                setTimeout(() => {
                    router.push("/funds");
                }, 2000);
            } else {
                setError(data.error || data.message || "Failed to create fund");
            }
        } catch (err) {
            console.error("Error creating fund:", err);
            setError("Network error. Please try again.");
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

                    <div className="max-w-5xl mx-auto">

                        {/* TOP */}
                        <div className="mb-10">

                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                Create Mutual Fund
                            </h1>

                            <p className="text-gray-500 mt-3 text-lg">
                                Add and manage investment funds in the marketplace
                            </p>
                        </div>

                        {/* MAIN GRID */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                            {/* FORM SECTION */}
                            <div className="xl:col-span-2">

                                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">

                                    {/* HEADER */}
                                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">

                                        <div>

                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Fund Information
                                            </h2>

                                            <p className="text-gray-500 mt-1">
                                                Enter details for the new mutual fund
                                            </p>
                                        </div>

                                        <div className="hidden md:flex w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 items-center justify-center text-3xl">
                                            📈
                                        </div>
                                    </div>

                                    {/* FORM */}
                                    <div className="p-8">

                                        {/* ERROR */}
                                        {error && (

                                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
                                                {error}
                                            </div>
                                        )}

                                        {/* SUCCESS */}
                                        {success && (

                                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4">
                                                {success}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-7"
                                        >

                                            {/* AMC ID */}
                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    AMC ID
                                                </label>

                                                <input
                                                    type="number"
                                                    name="amc_id"
                                                    value={formData.amc_id}
                                                    onChange={handleChange}
                                                    placeholder="Enter AMC ID"
                                                    required
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500"
                                                />

                                                <p className="text-xs text-gray-500 mt-2">
                                                    Example: 1 = HDFC, 2 = SBI, 3 = ICICI
                                                </p>
                                            </div>

                                            {/* FUND NAME */}
                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Fund Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="fund_name"
                                                    value={formData.fund_name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. HDFC Balanced Advantage Fund"
                                                    required
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500"
                                                />
                                            </div>

                                            {/* CATEGORY */}
                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Fund Category
                                                </label>

                                                <select
                                                    name="fund_type"
                                                    value={formData.fund_type}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500"
                                                >

                                                    <option value="">
                                                        Select Category
                                                    </option>

                                                    <option value="Equity - Large Cap">
                                                        Equity - Large Cap
                                                    </option>

                                                    <option value="Equity - Mid Cap">
                                                        Equity - Mid Cap
                                                    </option>

                                                    <option value="Equity - Small Cap">
                                                        Equity - Small Cap
                                                    </option>

                                                    <option value="Equity - ELSS">
                                                        Equity - ELSS
                                                    </option>

                                                    <option value="Hybrid">
                                                        Hybrid
                                                    </option>

                                                    <option value="Debt">
                                                        Debt
                                                    </option>

                                                    <option value="Index Fund">
                                                        Index Fund
                                                    </option>
                                                </select>
                                            </div>

                                            {/* BUTTONS */}
                                            <div className="pt-4 flex flex-col md:flex-row gap-4">

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition-all hover:scale-[1.01] disabled:opacity-50"
                                                >
                                                    {loading
                                                        ? "Creating Fund..."
                                                        : "Create Fund"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.push("/funds")
                                                    }
                                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* SIDEBAR INFO */}
                            <div className="space-y-6">

                                {/* AMC CARD */}
                                <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm p-7">

                                    <div className="flex items-center gap-4 mb-6">

                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                                            🏦
                                        </div>

                                        <div>

                                            <h3 className="text-xl font-bold text-gray-900">
                                                Existing AMCs
                                            </h3>

                                            <p className="text-gray-500 text-sm mt-1">
                                                Registered asset management companies
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">

                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">

                                            <span className="text-gray-700 font-medium">
                                                AMC ID 1
                                            </span>

                                            <span className="font-bold text-gray-900">
                                                HDFC
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">

                                            <span className="text-gray-700 font-medium">
                                                AMC ID 2
                                            </span>

                                            <span className="font-bold text-gray-900">
                                                SBI
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">

                                            <span className="text-gray-700 font-medium">
                                                AMC ID 3
                                            </span>

                                            <span className="font-bold text-gray-900">
                                                ICICI
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* INFO CARD */}
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[32px] p-7 text-white shadow-lg">

                                    <h3 className="text-2xl font-bold">
                                        Fund Creation
                                    </h3>

                                    <p className="mt-4 text-purple-100 leading-relaxed">
                                        Ensure all mutual fund information is accurate before publishing to investors.
                                    </p>

                                    <div className="mt-8 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl">

                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>

                                        <span className="text-sm">
                                            Secure Investment Platform
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}