import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'm4s@2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, rows } = body;

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: 'Unauthorized passcode' }, { status: 401 });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No rows provided' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase admin client unavailable' }, { status: 500 });
    }

    // 1. Fetch existing NST students to exclude from General updates
    const { data: nstStudents } = await supabase
      .from('registrations')
      .select('id, email, first_name, last_name')
      .ilike('category', '%NST%');

    const nstEmailSet = new Set((nstStudents || []).map(n => (n.email || '').toLowerCase().trim()));
    const nstNameSet = new Set((nstStudents || []).map(n => `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ')));

    // 2. Fetch all General registrations
    const { data: dbGeneral } = await supabase
      .from('registrations')
      .select('*')
      .not('category', 'ilike', '%NST%');

    const generalList = dbGeneral || [];

    // 3. Parse and filter gateway rows
    const generalGatewayRows: Array<{
      buyerName: string;
      email: string;
      phone: string;
      amount: number;
      race: string;
      custId: string;
      txnId: string;
    }> = [];

    for (const r of rows) {
      const keys = Object.keys(r);
      const getVal = (pattern: RegExp) => {
        const k = keys.find(key => pattern.test(key));
        return k ? String(r[k] || '').trim() : '';
      };

      const email = getVal(/email/i).toLowerCase();
      const buyerName = getVal(/buyer|name|student/i);
      const phone = getVal(/contact|phone|mobile/i).replace(/[^0-9]/g, '');
      const custId = getVal(/customer\s*id/i);
      const txnId = getVal(/transaction\s*id/i);
      const category = getVal(/category|race|tier/i);
      const amountStr = getVal(/total\s*amount|amount|price/i).replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr) || (category.toLowerCase().includes('comp') ? 249 : 149);

      const isNst =
        email.endsWith('@adypu.edu.in') ||
        nstEmailSet.has(email) ||
        nstNameSet.has(buyerName.toLowerCase().replace(/\s+/g, ' '));

      if (isNst) {
        // If NST student is in gateway with a valid transaction, ensure their payment status is marked paid
        const nstMatch = (nstStudents || []).find(n =>
          (n.email || '').toLowerCase().trim() === email ||
          `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === buyerName.toLowerCase().replace(/\s+/g, ' ')
        );
        if (nstMatch) {
          await supabase.from('registrations').update({
            payment_status: 'paid',
            amount: amount || 149,
            razorpay_order_id: custId || 'GATEWAY',
            razorpay_payment_id: txnId || 'GATEWAY',
          }).eq('id', nstMatch.id);
        }
      } else if (email || phone || buyerName) {
        const race = category.toLowerCase().includes('non') || category.toLowerCase().includes('joy')
          ? 'Non-Competitive Joy 5K'
          : 'Competitive 5K';

        generalGatewayRows.push({
          buyerName,
          email,
          phone,
          amount,
          race,
          custId,
          txnId,
        });
      }
    }

    // 4. Update General Public Registrations
    let updatedPaidCount = 0;

    for (const gen of generalList) {
      const match = generalGatewayRows.find(gw =>
        (gw.email && gen.email && gen.email.toLowerCase().trim() === gw.email) ||
        (gw.phone && gen.phone && gen.phone.replace(/[^0-9]/g, '').slice(-10) === gw.phone.slice(-10)) ||
        (gw.buyerName && `${gen.first_name} ${gen.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === gw.buyerName.toLowerCase().replace(/\s+/g, ' '))
      );

      if (match) {
        await supabase.from('registrations').update({
          payment_status: 'paid',
          amount: match.amount,
          race_type: match.race,
          razorpay_order_id: match.custId || 'GATEWAY',
          razorpay_payment_id: match.txnId || 'GATEWAY',
          phone: match.phone && match.phone.length >= 10 ? match.phone : gen.phone,
        }).eq('id', gen.id);
        updatedPaidCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${rows.length} sheet rows. Matched and verified ${updatedPaidCount} General Public payments.`,
      generalPaid: updatedPaidCount,
      totalGeneralInDb: generalList.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/sync/gateway:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
