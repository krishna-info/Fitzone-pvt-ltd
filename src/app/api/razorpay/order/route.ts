import { NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
