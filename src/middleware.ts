import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Protect /admin routes (except /admin/login)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  let user = null;
  const token = request.cookies.get('auth_token')?.value;

  if (token) {
    user = await verifyAuth(token);
  }

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, redirect away from login page
  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
