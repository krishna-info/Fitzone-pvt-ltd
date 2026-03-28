'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function updateProduct(formData: FormData) {
  const supabase = createSupabaseServerClient();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price_inr = parseInt(formData.get('price_inr') as string);
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true';

  const { error } = await supabase
    .from('products')
    .update({ name, price_inr, description, is_active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

import { Product } from '@/lib/product-types';

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await supabase
    .from('products')
    .insert([productData]);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
