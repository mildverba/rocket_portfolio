import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const secretPassword = process.env.APP_PASSWORD;

    if (!secretPassword) {
      console.error("[AUTH] APP_PASSWORD is not set in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (password === secretPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure, HTTP-only cookie for 5 days
      // 5 days = 5 * 24 * 60 * 60 = 432,000 seconds
      response.cookies.set('portfolio_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_VERSION !== 'development',
        sameSite: 'lax',
        maxAge: 432000, 
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
