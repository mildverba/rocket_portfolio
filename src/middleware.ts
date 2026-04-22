import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths (static files, favicon, login page, and login API)
  const isPublicPath = 
    pathname === '/login' || 
    pathname === '/api/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // matches favicon.ico, images, etc.
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
  // Protect everything except for the public paths checked above
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
