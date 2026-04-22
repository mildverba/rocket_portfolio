import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define public paths that don't require authentication
  const isPublicPath = 
    pathname === '/login' || 
    pathname === '/api/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname.includes('favicon.ico');

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2. Check for the session cookie
  const session = request.cookies.get('portfolio_session');

  if (!session) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Use a negative lookahead to exclude static assets
  matcher: ['/((?!api/auth/login|_next/static|_next/image|favicon.ico).*)'],
};
