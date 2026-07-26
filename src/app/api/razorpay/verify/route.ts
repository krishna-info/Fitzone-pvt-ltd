import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';


async function verifySignature(body: string, signature: string, secret: string) {
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

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerDetails,
      items
    } = (await req.json()) as any;

    // 1. Verify Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const isValid = await verifySignature(body.toString(), razorpay_signature, keySecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Calculations
    const subtotal = items.reduce((sum: number, item: { price?: number; quantity: number }) => sum + (item.price || 0) * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 150;
    const total = subtotal + shipping;

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database context unavailable' }, { status: 500 });
    }

    // 3. Idempotency Check
    try {
      const { results: existing } = await db.prepare(
        'SELECT id FROM orders WHERE razorpay_order_id = ? OR payment_id = ?'
      ).bind(razorpay_order_id, razorpay_payment_id).all();

      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, orderId: existing[0].id });
      }
    } catch (checkErr) {
      console.warn('Idempotency check warning:', checkErr);
    }

    // 4. Build Atomic Batch Statements
    const orderId = crypto.randomUUID();
    const stmts: any[] = [];

    stmts.push(
      db.prepare(`
        INSERT INTO orders (
          id, customer_name, customer_email, customer_phone, shipping_address, city, pincode, subtotal, shipping, total, status, payment_id, razorpay_order_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId, customerDetails.name, customerDetails.email, customerDetails.phone, customerDetails.address, customerDetails.city, customerDetails.pincode, subtotal, shipping, total, 'processing', razorpay_payment_id, razorpay_order_id
      )
    );

    for (const item of items) {
      stmts.push(
        db.prepare(`
          INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price_at_purchase, size, color)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(), orderId, item.productId, item.name, item.quantity, item.price || 0, item.size || null, item.color || null
        )
      );
    }

    stmts.push(
      db.prepare(`
        INSERT INTO payments (id, order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, total, 'captured'
      )
    );

    // Execute single atomic transaction
    await db.batch(stmts);

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
