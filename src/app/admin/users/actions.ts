'use server';

import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const supabase = createSupabaseAdminClient();
  
  // Fetch profiles with joined auth.users data via Admin API
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return users;
}

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const role = formData.get('role') as string;

  const supabase = createSupabaseAdminClient();

  // Create user in Auth
  const { error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role }
  });

  if (authError) throw new Error(authError.message);

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(userId: string, data: { full_name?: string; role?: string }) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = createSupabaseAdminClient();

  // Deleting from auth.users will cascade to public.profiles due to FK
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
  return { success: true };
}
