import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import crypto from 'crypto';

// Razorpay sends a signature we must verify with our secret
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expected === signature;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

    // Verify signature if secret is set
    if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, payload } = event;

    if (eventType === 'payment.captured' || eventType === 'payment.failed') {
      const payment = payload?.payment?.entity;
      if (payment && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createSupabaseAdminClient();
        await supabase.from('payments').insert({
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: eventType === 'payment.captured' ? 'captured' : 'failed',
          reference: payment.description ?? null,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
