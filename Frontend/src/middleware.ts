import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = request.nextUrl;

    // Public routes
    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
        return NextResponse.next();
    }

    // Not authenticated - redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = token.role as string;

    // Admin dashboard - only SUPER_ADMIN
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard_company')) {
        if (role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard_company', request.url));
        }
    }

    // Company dashboard - only COMPANY
    if (pathname.startsWith('/dashboard_company')) {
        if (role === 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/dashboard_company/:path*']
};
