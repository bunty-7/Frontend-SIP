// proxy.js
import { NextResponse } from "next/server";

export function proxy(req) {
    const token = req.cookies.get("token");

    // Protected routes
    const protectedRoutes = ["/dashboard", "/investor", "/funds", "/sips"];
    const isProtectedRoute = protectedRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
    );

    // ✅ Redirect to /login (not /logout) if no token
    if (isProtectedRoute && !token) {
        console.log("No token, redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ If already logged in and trying to access login, go to dashboard
    if (req.nextUrl.pathname === "/login" && token) {
        console.log("Already logged in, redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/investor/:path*", "/funds/:path*", "/sips/:path*", "/login"]
};