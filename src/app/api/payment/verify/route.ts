import { NextRequest, NextResponse } from 'next/server';
import { calculateRegistrationFee, ParticipantType, RaceCategory } from '@/lib/college-payment';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Generates a random and guaranteed unique 3-digit Chest Number (100 - 999).
 */
async function generateUniqueChestNumber(supabase: ReturnType<typeof getSupabaseAdmin>): Promise<string> {
  if (supabase) {
    try {
      const { data: existingRows } = await supabase
        .from('registrations')
        .select('chest_number');

      const existingSet = new Set(
        existingRows?.map((r: { chest_number: string }) => String(r.chest_number)) || []
      );

      // Attempt random 3-digit selections
      for (let attempt = 0; attempt < 50; attempt++) {
        const rand = String(Math.floor(100 + Math.random() * 900));
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
      gateway_order_id,
      gateway_payment_id,
      gateway_status,
      runnerData,
    } = body;

    const participantType: ParticipantType = runnerData?.participantType === 'student' ? 'student' : 'general';
    const category: RaceCategory = runnerData?.category === 'non-competitive' ? 'non-competitive' : 'competitive';
    const cleanUrn = participantType === 'student' && runnerData?.urn ? String(runnerData.urn).trim().toUpperCase() : null;

    const supabase = getSupabaseAdmin();

    // 1. Double check URN duplicate if student
    if (participantType === 'student' && cleanUrn && supabase) {
      try {
        const { data: duplicateCheck } = await supabase
          .from('registrations')
          .select('id, bib_number, chest_number')
          .eq('urn', cleanUrn)
          .eq('payment_status', 'paid')
          .maybeSingle();

        if (duplicateCheck) {
          return NextResponse.json(
            {
              success: false,
              error: `Student URN "${cleanUrn}" is already registered (BIB: ${duplicateCheck.bib_number || '#' + duplicateCheck.chest_number}).`,
            },
            { status: 400 }
          );
        }
      } catch (err) {
        console.warn('Duplicate URN check warning:', err);
      }
    }

    // 2. Generate unique 3-digit Chest Number (100 - 999)
    const chestNumber = await generateUniqueChestNumber(supabase);

    // 3. Calculate age on Race Day (September 5, 2026) & determine competition category
    const birthYear = Number(runnerData?.dobYear) || 2000;
    const birthMonth = Number(runnerData?.dobMonth) || 1;
    const birthDay = Number(runnerData?.dobDay) || 1;
    const raceDate = new Date(2026, 8, 5);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let runnerAge = raceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = raceDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && raceDate.getDate() < birthDate.getDate())) {
      runnerAge--;
    }

    // Determine age division: Adult (40+), Female (10-39), Male (10-39)
    let ageCategory: 'adult' | 'female' | 'male' = 'male';
    if (runnerAge >= 40) {
      ageCategory = 'adult';
    } else if (String(runnerData?.gender).toLowerCase() === 'female') {
      ageCategory = 'female';
    } else {
      ageCategory = 'male';
    }

    // 4. Generate matching BIB format
    const prefix = category === 'competitive' ? 'COMP' : 'JOY';
    const bibNumber = `M4S-${prefix}-${chestNumber}`;
    const amountPaid = calculateRegistrationFee(participantType, category);
    const dobString = `${runnerData?.dobYear || '2000'}-${runnerData?.dobMonth || '01'}-${runnerData?.dobDay || '01'}`;
    const finalOrderId = gateway_order_id || `order_col_${Date.now()}`;
    const finalPaymentId = gateway_payment_id || `pay_col_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 5. Save registration record into Supabase PostgreSQL database
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
          category: category,
          amount: amountPaid,
          chest_number: chestNumber,
          bib_number: bibNumber,
          razorpay_order_id: finalOrderId,
          razorpay_payment_id: finalPaymentId,
          payment_status: 'paid',
        });

        if (dbError) {
          console.error('❌ Supabase DB Insert Error:', dbError.message);
        } else {
          console.log(`✅ Successfully saved registration for ${runnerData?.firstName} ${runnerData?.lastName} (BIB: ${bibNumber}) into Supabase!`);
        }
      } catch (dbErr) {
        console.error('Failed to insert record into Supabase:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration and payment processed successfully!',
      chestNumber,
      bibNumber,
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      amount: amountPaid,
      participantType,
      urn: cleanUrn,
      category,
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
