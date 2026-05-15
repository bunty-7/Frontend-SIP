"use client";

import { useState } from "react";

export default function StartSIPModal({
    fund,
    onClose,
    onSuccess,
}) {

    const [sipAmount, setSipAmount] = useState(5000);

    const [sipDate, setSipDate] = useState("5");

    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const sipDates = Array.from(
        { length: 28 },
        (_, i) => i + 1
    );

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError("Please login again");
                return;
            }

            // DECODE TOKEN
            const base64Url =
                token.split(".")[1];

            const base64 = base64Url
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const decoded = JSON.parse(
                atob(base64)
            );

            const investorId =
                decoded.investor_id ||
                decoded.id;

            // VERIFY INVESTOR
            const investorResponse =
                await fetch(
                    `http://localhost:4000/api/investors/${investorId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            if (!investorResponse.ok) {
                throw new Error(
                    "Investor not found"
                );
            }

            // PORTFOLIO
            let portfolioId =
                localStorage.getItem(
                    `portfolio_${investorId}`
                );

            if (!portfolioId) {

                portfolioId = investorId;

                localStorage.setItem(
                    `portfolio_${investorId}`,
                    portfolioId
                );
            }

            // CREATE SIP
            const sipResponse =
                await fetch(
                    "http://localhost:4000/api/sips",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            portfolio_id:
                                parseInt(
                                    portfolioId
                                ),

                            fund_id:
                                fund.fund_id,

                            sip_amount:
                                sipAmount,

                            sip_date:
                                sipDate,

                            start_date:
                                startDate,
                        }),
                    }
                );

            const sipData =
                await sipResponse.json();

            if (sipResponse.ok) {

                alert(
                    `✅ SIP Started Successfully!\n\nFund: ${fund.fund_name}\nAmount: ₹${sipAmount}\nSIP Date: Day ${sipDate}`
                );

                onSuccess();

                onClose();

                window.location.reload();

            } else {

                setError(
                    sipData.error ||
                    sipData.message ||
                    "Failed to start SIP"
                );
            }

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto">

            {/* MODAL */}
            <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* HEADER */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">

                    <div className="flex items-start justify-between">

                        <div>

                            <h2 className="text-3xl font-bold text-gray-900">
                                Start SIP
                            </h2>

                            <p className="text-gray-500 mt-2 text-sm">
                                Invest consistently and build long-term wealth
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-11 h-11 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-500 hover:text-black text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-8">

                    {/* FUND CARD */}
                    <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-3xl p-5">

                        <p className="text-sm text-gray-500 mb-2">
                            Selected Fund
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900">
                            {fund.fund_name}
                        </h3>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* SIP AMOUNT */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                SIP Amount
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    value={sipAmount}
                                    onChange={(e) =>
                                        setSipAmount(
                                            parseInt(
                                                e.target
                                                    .value
                                            )
                                        )
                                    }
                                    min="500"
                                    step="500"
                                    required
                                    className="w-full pl-10 pr-4 py-4 rounded-2xl border border-gray-300 bg-gray-50 text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                                />
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Minimum investment amount ₹500
                            </p>
                        </div>

                        {/* SIP DATE */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                SIP Date
                            </label>

                            <select
                                value={sipDate}
                                onChange={(e) =>
                                    setSipDate(
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-4 rounded-2xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                            >

                                {sipDates.map((day) => (

                                    <option
                                        key={day}
                                        value={day}
                                    >
                                        Day {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* START DATE */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full px-4 py-4 rounded-2xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                            />
                        </div>

                        {/* ERROR */}
                        {error && (

                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-4 text-sm">
                                {error}
                            </div>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            {loading
                                ? "Processing..."
                                : "Start SIP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}