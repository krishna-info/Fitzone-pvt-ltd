'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const db = getDb();
  
  try {
    const { results } = await db.prepare('SELECT * FROM profiles ORDER BY created_at DESC').all<any>();
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const role = formData.get('role') as string;

  const db = getDb();

  try {
    await db.prepare(`
      INSERT INTO profiles (id, email, password, full_name, role)
      VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)
    `).bind(email, password, fullName, role).run();
  } catch (error: any) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(userId: string, data: { full_name?: string; role?: string }) {
  const db = getDb();

  try {
    if (data.full_name && data.role) {
      await db.prepare('UPDATE profiles SET full_name = ?, role = ? WHERE id = ?').bind(data.full_name, data.role, userId).run();
    } else if (data.full_name) {
      await db.prepare('UPDATE profiles SET full_name = ? WHERE id = ?').bind(data.full_name, userId).run();
    } else if (data.role) {
      await db.prepare('UPDATE profiles SET role = ? WHERE id = ?').bind(data.role, userId).run();
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUser(userId: string) {
  const db = getDb();

  try {
    await db.prepare('DELETE FROM profiles WHERE id = ?').bind(userId).run();
  } catch (error: any) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/users');
  return { success: true };
}
