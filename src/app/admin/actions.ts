'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let user = null;
    try {
      const db = getDb();
      if (db) {
        // Checking against multiple valid admin roles
        const validAdminRoles = ['admin', 'superadmin', 'manager'];
        const placeholders = validAdminRoles.map(() => '?').join(',');
        
        user = (await db.prepare(`SELECT * FROM profiles WHERE email = ? AND role IN (${placeholders})`)
          .bind(email, ...validAdminRoles)
          .first()) as any;
      }
    } catch (dbError) {
      console.warn('Database query failed or unavailable, falling back to ENV credentials');
    }

    if (!user || user.password !== password) {
      // Fallback check against env var if DB fails
      let adminEmail = process.env.ADMIN_EMAIL;
      let adminPassword = process.env.ADMIN_PASSWORD;
      
      try {
        const env = getCloudflareContext().env as any;
        if (env?.ADMIN_EMAIL) adminEmail = env.ADMIN_EMAIL;
        if (env?.ADMIN_PASSWORD) adminPassword = env.ADMIN_PASSWORD;
      } catch (e) {
        // Ignore context errors
      }

      if (email !== adminEmail || password !== adminPassword) {
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
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: err.message || 'A network error occurred. Please try again later.' };
  }

  // Redirect to admin dashboard
  redirect('/admin');
}

export async function signOut() {
  cookies().delete('auth_token');
  redirect('/admin/login');
}
