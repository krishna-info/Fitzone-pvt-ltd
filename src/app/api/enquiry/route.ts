import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, enquiry_type = 'bulk_order' } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Insert into Supabase contact_enquiries table
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdminClient();
      const { error: dbError } = await supabase
        .from('contact_enquiries')
        .insert({
          name: 'Bulk Enquiry (Cart)',
          email: 'via-whatsapp@fitzone.in',
          enquiry_type,
          message: JSON.stringify(items),
        });

      if (dbError) {
        console.error('Supabase enquiry insert error:', dbError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
