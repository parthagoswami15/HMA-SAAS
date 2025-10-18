import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password', '/'];

// Define routes that require authentication
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Get token from cookies OR check if it might be in localStorage
  // Note: We can't directly access localStorage in middleware (server-side)
  // So we'll check cookies for now. The client-side will handle localStorage.
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('accessToken')?.value;

  // For localStorage-based auth, we can't check here, so we disable server-side redirect
  // and let client-side handle it. Only block if we're certain there's no auth.
  // Comment out the redirect for now since we're using localStorage
  // if (isProtectedRoute && !token) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Allow all requests to pass through
  // Client-side useEffect will handle auth checks for localStorage-based auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
