'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function requestReturn(orderId: string, reason: string, upiId?: string) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await supabase
    .from('orders')
    .update({
      return_status: 'requested',
      return_reason: reason,
      refund_upi_id: upiId || null,
      return_requested_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateReturnStatus(orderId: string, returnStatus: string) {
  const supabase = createSupabaseServerClient();
  
  const updateData: any = { return_status: returnStatus };
  if (returnStatus === 'refunded') {
    updateData.refund_processed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}
