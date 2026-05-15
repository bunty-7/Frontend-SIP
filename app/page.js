"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Always redirect to login page
        router.push("/login");
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ececf3]">
            <div className="text-xl">Redirecting to login...</div>
        </div>
    );
}