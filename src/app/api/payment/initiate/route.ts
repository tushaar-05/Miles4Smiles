import { NextRequest, NextResponse } from 'next/server';
import { calculateRegistrationFee, COLLEGE_GATEWAY_CONFIG, ParticipantType, RaceCategory } from '@/lib/college-payment';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      participantType = 'general',
      urn,
      collegeName,
      category = 'competitive',
      email,
      phone,
      firstName,
      lastName,
    } = body;

    const cleanType: ParticipantType = participantType === 'student' ? 'student' : 'general';
    const cleanCategory: RaceCategory = category === 'non-competitive' ? 'non-competitive' : 'competitive';
    const cleanUrn = urn ? String(urn).trim().toUpperCase() : '';

    // 1. Validation for College Students
    if (cleanType === 'student') {
      if (!cleanUrn) {
        return NextResponse.json(
          { success: false, error: 'University Registration Number (URN) is required for student registration.' },
          { status: 400 }
        );
      }

      // Check if this URN has already been registered in Supabase
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: existingStudent, error: checkError } = await supabase
            .from('registrations')
            .select('id, bib_number, chest_number')
            .eq('urn', cleanUrn)
            .eq('payment_status', 'paid')
            .maybeSingle();

          if (checkError) {
            console.warn('Error checking existing URN:', checkError.message);
          } else if (existingStudent) {
            return NextResponse.json(
              {
                success: false,
                error: `URN "${cleanUrn}" is already registered (BIB: ${existingStudent.bib_number || '#' + existingStudent.chest_number}). Each student URN can only be used once.`,
              },
              { status: 400 }
            );
          }
        } catch (dbErr) {
          console.warn('Supabase URN verification skipped/failed:', dbErr);
        }
      }
    }

    // 2. Calculate Fee securely on server
    const amount = calculateRegistrationFee(cleanType, cleanCategory);

    // 3. Generate unique transaction order reference
    const orderId = `order_${cleanType}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      currency: 'INR',
      participantType: cleanType,
      urn: cleanType === 'student' ? cleanUrn : undefined,
      collegeName: cleanType === 'student' ? collegeName : undefined,
      gatewayUrl: COLLEGE_GATEWAY_CONFIG.url || null,
      merchantId: COLLEGE_GATEWAY_CONFIG.merchantId,
      notes: {
        category: cleanCategory,
        runnerName: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email || '',
        phone: phone || '',
      },
    });
  } catch (error: unknown) {
    console.error('Error initiating payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
