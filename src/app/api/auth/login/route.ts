import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Get credentials from environment variables
    const targetUser = process.env.APP_USERNAME;
    const targetPass = process.env.APP_PASSWORD;

    if (!targetUser || !targetPass) {
      console.error("[AUTH] APP_USERNAME or APP_PASSWORD not set in Vercel.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (username === targetUser && password === targetPass) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure, HTTP-only cookie for 5 days
      response.cookies.set('portfolio_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 432000, // 5 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
