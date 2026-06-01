import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readDb } from '@/lib/db';
import { verifyPassword, signSession, verifySession } from '@/lib/auth';

// GET: Check session status
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = verifySession(token);

  if (session) {
    return NextResponse.json({ authenticated: true, username: session.username });
  }

  return NextResponse.json({ authenticated: false });
}

// POST: Login
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const db = await readDb();
    const authData = db.auth;

    if (!authData) {
      return NextResponse.json({ success: false, error: "Base d'authentification manquante" }, { status: 500 });
    }

    const isValid = username === authData.username && verifyPassword(password, authData.salt, authData.passwordHash);

    if (isValid) {
      const token = signSession({ username });
      const cookieStore = await cookies();
      
      // Set secure cookie
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Identifiant ou mot de passe incorrect' }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// DELETE: Logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true });
}
