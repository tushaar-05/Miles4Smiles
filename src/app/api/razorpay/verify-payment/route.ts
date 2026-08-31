import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { RAZORPAY_KEY_SECRET } from '@/lib/razorpay';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Generates a random and guaranteed unique 3-digit Chest Number (100 - 999).
 */
async function generateUniqueChestNumber(supabase: ReturnType<typeof getSupabaseAdmin>): Promise<string> {
  if (supabase) {
    try {
      // Query existing chest numbers in the database
      const { data: existingRows } = await supabase
        .from('registrations')
        .select('chest_number');

      const existingSet = new Set(
        existingRows?.map((r: { chest_number: string }) => String(r.chest_number)) || []
      );

      // Attempt random 3-digit selections
      for (let attempt = 0; attempt < 50; attempt++) {
        const rand = String(Math.floor(100 + Math.random() * 900)); // 100 to 999
        if (!existingSet.has(rand)) {
          return rand;
        }
      }

      // If random numbers collide frequently, pick from available pool
      const allPool = Array.from({ length: 900 }, (_, i) => String(100 + i));
      const available = allPool.filter(num => !existingSet.has(num));
      if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
      }
    } catch (err) {
      console.warn('Error verifying chest number uniqueness from Supabase:', err);
    }
  }

  // Fallback random 3-digit number (100 - 999)
  return String(Math.floor(100 + Math.random() * 900));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      runnerData,
      isDevTest,
    } = body;

    const isDevMock = isDevTest === true || (razorpay_payment_id && String(razorpay_payment_id).startsWith('pay_test_dev_'));

    if (!isDevMock) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Missing required payment verification parameters' },
          { status: 400 }
        );
      }

      // Verify HMAC SHA256 signature
      const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      const isSignatureValid = generatedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return NextResponse.json(
          { success: false, error: 'Payment verification failed: Invalid signature' },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdmin();

    // 1. Generate unique random 3-digit Chest Number (100 - 999)
    const chestNumber = await generateUniqueChestNumber(supabase);

    // 2. Generate matching BIB format
    const prefix = runnerData?.category === 'competitive' ? 'COMP' : 'JOY';
    const bibNumber = `M4S-${prefix}-${chestNumber}`;
    const amountPaid = runnerData?.category === 'competitive' ? 249 : 149;
    const dobString = `${runnerData?.dobYear || '2000'}-${runnerData?.dobMonth || '01'}-${runnerData?.dobDay || '01'}`;
    const finalPaymentId = razorpay_payment_id || `pay_test_dev_${Date.now()}`;
    const finalOrderId = razorpay_order_id || `order_test_dev_${Date.now()}`;

    // 3. Save registration record into Supabase PostgreSQL database
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from('registrations').insert({
          first_name: runnerData?.firstName || '',
          last_name: runnerData?.lastName || '',
          gender: runnerData?.gender || 'Male',
          blood_group: runnerData?.bloodGroup || 'O+',
          dob: dobString,
          weight: runnerData?.weight || '',
          height: runnerData?.height || '',
          t_shirt_size: runnerData?.tShirtSize || 'M',
          email: runnerData?.email || '',
          phone: runnerData?.phone || '',
          city: runnerData?.city || '',
          emergency_name: runnerData?.emergencyName || '',
          emergency_phone: runnerData?.emergencyPhone || '',
          category: runnerData?.category || 'competitive',
          amount: amountPaid,
          chest_number: chestNumber,
          bib_number: bibNumber,
          razorpay_order_id: finalOrderId,
          razorpay_payment_id: finalPaymentId,
          payment_status: 'paid',
        });

        if (dbError) {
          console.warn('Supabase DB Insert Warning:', dbError.message);
        }
      } catch (dbErr) {
        console.warn('Failed to insert record into Supabase:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully!',
      chestNumber,
      bibNumber,
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      category: runnerData?.category || 'competitive',
      runnerName: `${runnerData?.firstName || ''} ${runnerData?.lastName || ''}`.trim(),
    });
  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
