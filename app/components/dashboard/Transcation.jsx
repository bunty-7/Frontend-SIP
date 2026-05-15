"use client";

import { useState, useEffect } from "react";

export default function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Not authenticated");
                setLoading(false);
                return;
            }

            // Fetch investor details first to get investor ID
            // Decode token to get email
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const userInfo = JSON.parse(jsonPayload);

            // If backend has investor holdings endpoint
            const response = await fetch(`http://localhost:4000/api/investors/${userInfo.email}/holdings`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Transform holdings into transaction format
                const transactionData = data.map((item, index) => ({
                    id: index,
                    date: item.purchase_date || new Date().toISOString().split('T')[0],
                    amount: item.invested_amount || 0,
                    type: "SIP Payment",
                    fund: item.fund_name || "Mutual Fund",
                    status: "Completed"
                }));
                setTransactions(transactionData);
                calculateTotalInvestment(transactionData);
            } else {
                // If no real data, show empty state (not sample data)
                setTransactions([]);
                setTotalInvestment(0);
                if (response.status === 404) {
                    setError("No transactions found");
                } else {
                    setError("Failed to fetch transactions");
                }
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Could not connect to backend");
            setTransactions([]);
            setTotalInvestment(0);
        } finally {
            setLoading(false);
        }
    }

    function calculateTotalInvestment(transactions) {
        const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        setTotalInvestment(total);
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center">Loading transactions...</div>
            </div>
        );
    }

    if (error && transactions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center text-gray-500">
                    <p>{error}</p>
                    <p className="text-sm mt-2">No investment data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm opacity-90">Total Investment</p>
                    <p className="text-3xl font-bold mt-2">₹{totalInvestment.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm opacity-90">Active SIPs</p>
                    <p className="text-3xl font-bold mt-2">{transactions.length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm opacity-90">Total Returns</p>
                    <p className="text-3xl font-bold mt-2">Calculating...</p>
                </div>
            </div>

            {transactions.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fund Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.fund}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.type}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                {transaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}