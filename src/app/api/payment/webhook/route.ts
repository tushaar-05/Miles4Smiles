import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Easebuzz Payment Webhook Handler
 * 
 * Endpoint: POST /api/payment/webhook
 * 
 * Whenever a user pays on Easebuzz, Easebuzz automatically sends an HTTP POST
 * to this endpoint with payer information and transaction details.
 */
export async function GET() {
  return NextResponse.json({ status: 'active', message: 'Miles for Smiles Payment Webhook Endpoint' });
}

export async function POST(req: NextRequest) {
  try {
    let payload: Record<string, unknown> = {};

    // Easebuzz sends either JSON or form-urlencoded payload
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value;
      });
    } else {
      const rawText = await req.text();
      try {
        payload = JSON.parse(rawText);
      } catch {
        // Parse urlencoded fallback
        const params = new URLSearchParams(rawText);
        params.forEach((value, key) => {
          payload[key] = value;
        });
      }
    }

    console.log('🔔 Received Payment Webhook Payload:', payload);

    // Extract Easebuzz payment parameters (handles various gateway naming formats)
    const status = String(payload.status || payload.payment_status || payload.tx_status || '').toLowerCase();
    const phone = String(payload.phone || payload.customer_phone || payload.contact || '').trim();
    const email = String(payload.email || payload.customer_email || '').trim().toLowerCase();
    const rawAmount = Number(payload.amount || payload.net_amount_debit || payload.payment_amount) || 0;
    const txnid = String(payload.txnid || payload.easepayid || payload.transaction_id || payload.payment_id || '');
    const productinfo = String(payload.productinfo || payload.description || payload.ticket_name || '').toLowerCase();

    // Verify if payment is successful
    const isSuccess = status === 'success' || status === 'paid' || status === 'completed' || status === 'captured';

    if (!isSuccess) {
      console.log(`⚠️ Webhook ignored for status: "${status}"`);
      return NextResponse.json({ success: true, message: 'Status noted (non-success)' });
    }

    // Determine Race Type based on Amount or Product Info
    // Competitive 5K: ₹249
    // Non-Competitive 5K: ₹149
    let raceType = 'Competitive 5K';
    if (rawAmount >= 200 || (productinfo.includes('competitive') && !productinfo.includes('non-competitive'))) {
      raceType = 'Competitive 5K';
    } else if ((rawAmount > 0 && rawAmount < 200) || productinfo.includes('non-competitive') || productinfo.includes('joy')) {
      raceType = 'Non-Competitive 5K';
    } else {
      raceType = rawAmount >= 249 ? 'Competitive 5K' : 'Non-Competitive 5K';
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error('❌ Supabase client unavailable in webhook');
      return NextResponse.json({ success: false, error: 'Database client not available' }, { status: 500 });
    }

    // Lookup matching registration in Supabase by Phone or Email
    let query = supabase.from('registrations').select('id, email, phone, first_name, last_name, bib_number');

    if (phone) {
      // Strip country code if 12 digits (e.g. 919876543210 -> 9876543210)
      const cleanPhone = phone.length > 10 ? phone.slice(-10) : phone;
      query = query.or(`phone.eq.${phone},phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      return NextResponse.json({ success: false, error: 'No phone or email provided in webhook' }, { status: 400 });
    }

    const { data: matchedRecords, error: lookupError } = await query;

    if (lookupError || !matchedRecords || matchedRecords.length === 0) {
      // If phone search failed, attempt email fallback
      if (email) {
        const { data: emailMatches } = await supabase
          .from('registrations')
          .select('id, email, phone, first_name, last_name, bib_number')
          .eq('email', email);

        if (emailMatches && emailMatches.length > 0) {
          const targetId = emailMatches[0].id;
          await updateRegistrationRecord(supabase, targetId, rawAmount, raceType, txnid);
          return NextResponse.json({ success: true, message: `Updated registration ${targetId} via email match` });
        }
      }

      console.warn(`⚠️ No matching registration found for Phone: "${phone}", Email: "${email}"`);
      return NextResponse.json({ success: true, message: 'No local registration matched, logged webhook' });
    }

    // Update the matched record
    const targetRecord = matchedRecords[0];
    await updateRegistrationRecord(supabase, targetRecord.id, rawAmount, raceType, txnid);

    console.log(`✅ Webhook processed successfully for ${targetRecord.first_name} ${targetRecord.last_name} (${targetRecord.bib_number})!`);

    return NextResponse.json({
      success: true,
      message: 'Registration marked as paid and race type updated',
      runner: `${targetRecord.first_name} ${targetRecord.last_name}`,
      raceType,
      amount: rawAmount,
    });
  } catch (error: unknown) {
    console.error('❌ Webhook error:', error);
    const msg = error instanceof Error ? error.message : 'Webhook handling failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

async function updateRegistrationRecord(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  recordId: string,
  amount: number,
  raceType: string,
  txnid: string
) {
  if (!supabase) return;

  const updateData: Record<string, unknown> = {
    payment_status: 'paid',
    amount: amount > 0 ? amount : undefined,
    razorpay_payment_id: txnid || `easebuzz_wh_${Date.now()}`,
  };

  // Attempt update including race_type
  const { error } = await supabase
    .from('registrations')
    .update({ ...updateData, race_type: raceType })
    .eq('id', recordId);

  // If race_type column is not in schema yet, fallback to base update
  if (error && (error.code === 'PGRST204' || error.message.includes('race_type'))) {
    await supabase.from('registrations').update(updateData).eq('id', recordId);
  }
}
