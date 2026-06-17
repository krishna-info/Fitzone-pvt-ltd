'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function requestReturn(orderId: string, reason: string, upiId?: string) {
  const db = getDb();
  
  try {
    await db.prepare(`
      UPDATE orders SET return_status = ?, return_reason = ?, refund_upi_id = ?, return_requested_at = ?
      WHERE id = ?
    `).bind('requested', reason, upiId || null, new Date().toISOString(), orderId).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = getDb();
  
  try {
    await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, orderId).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateReturnStatus(orderId: string, returnStatus: string) {
  const db = getDb();
  
  try {
    if (returnStatus === 'refunded') {
      await db.prepare('UPDATE orders SET return_status = ?, refund_processed_at = ? WHERE id = ?')
        .bind(returnStatus, new Date().toISOString(), orderId).run();
    } else {
      await db.prepare('UPDATE orders SET return_status = ? WHERE id = ?')
        .bind(returnStatus, orderId).run();
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}
