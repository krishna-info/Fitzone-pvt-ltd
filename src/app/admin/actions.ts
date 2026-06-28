'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let user = null;
    try {
      const db = getDb();
      if (db) {
        // For migration: checking against a profiles table that should contain the email & password
        user = (await db.prepare('SELECT * FROM profiles WHERE email = ? AND role = ?').bind(email, 'admin').first()) as any;
        console.log("user", user);
      }
    } catch (dbError) {
      console.warn('Database query failed or unavailable, falling back to ENV credentials');
    }

    if (!user || user.password !== password) {
      // Fallback check against env var if DB fails
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return { error: 'Invalid login credentials' };
      }
    }

    const token = await createToken({ userId: user?.id || 'admin-1', role: 'admin' });
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'A network error occurred. Please try again later.' };
  }

  // Redirect to admin dashboard
  redirect('/admin');
}

export async function signOut() {
  cookies().delete('auth_token');
  redirect('/admin/login');
}
