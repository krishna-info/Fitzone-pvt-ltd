'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';

export async function updateProduct(formData: FormData) {
  const supabase = createSupabaseServerClient();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const category_slug = formData.get('category_slug') as string;
  const price_inr = parseInt(formData.get('price_inr') as string);
  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true';
  const images_list = formData.get('images_list') as string;
  const images = images_list ? images_list.split(',').map(s => s.trim()).filter(Boolean) : [];
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  const { error } = await supabase
    .from('products')
    .update({ 
      name, 
      slug,
      category,
      category_slug,
      price_inr, 
      moq,
      images,
      description, 
      is_active, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath(`/products/${category_slug}`);
  revalidatePath(`/products/${category_slug}/${slug}`);
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
