import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contactSchema';
import { getDb } from '@/lib/db';


export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;

    // 1. Validate with Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, enquiryType, message, companyName } = parsed.data;

    const db = getDb();
    try {
      await db.prepare(`
        INSERT INTO contact_enquiries (name, email, phone, company_name, enquiry_type, message)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        name,
        email,
        phone ?? null,
        companyName ?? null,
        enquiryType ?? 'general',
        message
      ).run();
    } catch (dbError: any) {
      console.error('D1 insert error:', dbError.message);
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
