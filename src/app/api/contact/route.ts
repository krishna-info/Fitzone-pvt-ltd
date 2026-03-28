import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contactSchema';
import { supabaseAdmin } from '@/lib/supabase';

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

    const { name, email, phone, enquiryType, message, turnstileToken } = parsed.data;

    // 2. Turnstile Verification (enable when TURNSTILE_SECRET_KEY is set)
    if (process.env.TURNSTILE_SECRET_KEY) {
      const verifyRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { success: false, message: 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // 3. Insert into Supabase
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: dbError } = await supabaseAdmin
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
        // Don't fail silently — still attempt email
      }
    }

    // 4. Send email via Resend (enable when RESEND_API_KEY is set)
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FitZone Enquiries <no-reply@fitzone.in>',
          to: ['amrit@fitzone.in'],
          subject: `New Enquiry from ${name} — FitZone`,
          html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Phone:</strong> ${phone ?? 'Not provided'}</p>
                 <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
                 <p><strong>Message:</strong></p><p>${message}</p>`,
        }),
      });
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
