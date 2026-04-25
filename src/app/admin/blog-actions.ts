'use server';

import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function upsertPost(postData: Record<string, unknown>) {
  const supabase = createSupabaseAdminClient();
  
  // Ensure is_published is a boolean if it comes as a string from FormData
  const formattedData = {
    ...postData,
    is_published: postData.is_published === 'true' || postData.is_published === true
  };

  const { data, error } = await supabase
    .from('posts')
    .upsert(formattedData)
    .select()
    .single();

  if (error) {
    console.error('Error upserting post:', error);
    return { error: error.message };
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath('/admin/blog');
  
  return { data };
}

export async function deletePost(id: string) {
  const supabase = createSupabaseAdminClient();
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return { error: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  
  return { success: true };
}

export async function togglePostStatus(id: string, is_published: boolean) {
  const supabase = createSupabaseAdminClient();
  
  const { error } = await supabase
    .from('posts')
    .update({ is_published })
    .eq('id', id);

  if (error) {
    console.error('Error toggling post status:', error);
    return { error: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  
  return { success: true };
}
