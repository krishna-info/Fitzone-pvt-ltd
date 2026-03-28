import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerDetails,
      items
    } = await req.json();

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Calculations
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 150;
    const total = subtotal + shipping;

    // 3. Create Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        shipping_address: customerDetails.address,
        city: customerDetails.city,
        pincode: customerDetails.pincode,
        subtotal,
        shipping,
        total,
        status: 'processing',
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      price_at_purchase: item.price || 0,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Log Payment
    await supabaseAdmin.from('payments').insert({
      order_id: order.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: total,
      status: 'captured',
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
