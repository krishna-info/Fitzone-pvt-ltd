import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';


// Razorpay sends a signature we must verify with our secret
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') === signature;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

    // Verify signature if secret is set
    if (webhookSecret && !(await verifyWebhookSignature(rawBody, signature, webhookSecret))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, payload } = event;

    if (eventType === 'payment.captured' || eventType === 'payment.failed') {
      const payment = payload?.payment?.entity;
      if (payment) {
        const db = getDb();
        await db.prepare(`
          INSERT INTO payments (razorpay_order_id, razorpay_payment_id, amount, currency, status, reference)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          payment.order_id,
          payment.id,
          payment.amount,
          payment.currency,
          eventType === 'payment.captured' ? 'captured' : 'failed',
          payment.description ?? null
        ).run();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
