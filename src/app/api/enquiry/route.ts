import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { items, enquiry_type = 'bulk_order' } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const db = getDb();
    try {
      await db.prepare(`
        INSERT INTO contact_enquiries (name, email, enquiry_type, message)
        VALUES (?, ?, ?, ?)
      `).bind(
        'Bulk Enquiry (Cart)',
        'via-whatsapp@fitzoneapparels.com',
        enquiry_type,
        JSON.stringify(items)
      ).run();
    } catch (dbError: any) {
      console.error('D1 enquiry insert error:', dbError.message);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
