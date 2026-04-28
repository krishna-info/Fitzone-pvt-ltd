import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contactSchema';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate with Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, enquiryType, message } = parsed.data;

    // 3. Insert into Supabase
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdminClient();
      const { error: dbError } = await supabase
        .from('contact_enquiries')
        .insert({
          name,
          email,
          phone: phone ?? null,
          enquiry_type: enquiryType ?? 'general',
          message,
        });

      if (dbError) {
        console.error('Supabase insert error:', dbError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
