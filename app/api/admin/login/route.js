import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_session', crypto.randomUUID(), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24
    });
    return response;
  }

  return NextResponse.json({ ok: false, error: 'Username atau password salah.' }, { status: 401 });
}
