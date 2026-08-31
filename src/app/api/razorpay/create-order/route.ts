import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance, RAZORPAY_KEY_ID } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, email, phone, firstName, lastName } = body;

    const amountInINR = category === 'competitive' ? 249 : 149;
    const amountInPaise = amountInINR * 100;

    const razorpay = getRazorpayInstance();

    // Unique receipt reference
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        category: category === 'competitive' ? '5K Competitive Run' : '5K Joy Run (Non-Competitive)',
        runnerName: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email || '',
        phone: phone || '',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
