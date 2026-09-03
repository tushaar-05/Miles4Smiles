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

    // Detect if this is NST Google Form Responses or Gateway Data
    const firstRowKeys = Object.keys(rows[0] || {}).join(' ').toLowerCase();
    const isNstGoogleForm = firstRowKeys.includes('urn') || firstRowKeys.includes('t-shirt') || firstRowKeys.includes('screenshot');

    if (isNstGoogleForm) {
      // ─── Case 1: NST Google Form Responses Sync ───
      const { data: existingNst } = await supabase.from('registrations').select('*').ilike('category', '%NST%');
      const existingList = existingNst || [];

      let insertedCount = 0;
      let updatedCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const keys = Object.keys(r);
        const getVal = (pat: RegExp) => {
          const k = keys.find(key => pat.test(key));
          return k ? String(r[k] || '').trim() : '';
        };

        const email = getVal(/email/i).toLowerCase();
        const name = getVal(/name|student/i);
        const urn = getVal(/urn/i).toUpperCase();
        const gender = getVal(/gender/i) || 'Male';
        const tShirt = getVal(/t-shirt|size/i) || 'M';
        const weight = getVal(/weight/i) || '—';
        const height = getVal(/height/i) || '—';
        const year = getVal(/year/i) || '1st';
        const proof = getVal(/screenshot|proof|payment/i) || '—';
        const phone = getVal(/phone|contact/i) || '—';

        if (!name && !email) continue;

        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        const urnFormatted = urn || (email.includes('@adypu.edu.in') ? email.split('@')[0].toUpperCase() : '—');
        const city = `NST ADYPU • ${year} Year • URN: ${urnFormatted}`;

        // Check if student already in DB
        const match = existingList.find(e =>
          (email && e.email && e.email.toLowerCase().trim() === email) ||
          (urn && e.city && e.city.toUpperCase().includes(urn)) ||
          (`${e.first_name} ${e.last_name}`.toLowerCase().trim() === name.toLowerCase().trim())
        );

        if (match) {
          // Update details if needed
          await supabase.from('registrations').update({
            t_shirt_size: tShirt || match.t_shirt_size,
            weight: weight !== '—' ? weight : match.weight,
            height: height !== '—' ? height : match.height,
            phone: phone !== '—' ? phone : match.phone,
            emergency_name: proof !== '—' ? proof : match.emergency_name,
          }).eq('id', match.id);
          updatedCount++;
        } else {
          // Insert new NST student
          const totalCurrent = existingList.length + insertedCount;
          const chestNumber = `NST-${101 + totalCurrent}`;
          const bibNumber = `M4S-NST-${101 + totalCurrent}`;
          const isPaid = proof && proof.startsWith('http');

          await supabase.from('registrations').insert({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            blood_group: 'O+',
            dob: `${year} Year`,
            weight: weight,
            height: height,
            t_shirt_size: tShirt,
            email: email,
            phone: phone,
            city: city,
            emergency_name: proof,
            emergency_phone: '—',
            category: 'NST Student',
            race_type: isPaid ? 'Competitive 5K' : 'Pending Payment',
            amount: isPaid ? 149 : 0,
            chest_number: chestNumber,
            bib_number: bibNumber,
            razorpay_order_id: isPaid ? 'MANUAL_PROOF' : 'unknown',
            razorpay_payment_id: isPaid ? 'MANUAL_PROOF' : 'unknown',
            payment_status: isPaid ? 'paid' : 'pending',
          });
          insertedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `NST Form Sync: Inserted ${insertedCount} new students, updated ${updatedCount} existing students.`,
        inserted: insertedCount,
        updated: updatedCount,
        syncedAt: new Date().toISOString(),
      });
    }

    // ─── Case 2: Payment Gateway Sheet Sync ───
    const { data: nstStudents } = await supabase
      .from('registrations')
      .select('id, email, first_name, last_name, city')
      .ilike('category', '%NST%');

    const nstEmailSet = new Set((nstStudents || []).map(n => (n.email || '').toLowerCase().trim()));
    const nstNameSet = new Set((nstStudents || []).map(n => `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ')));

    const { data: dbGeneral } = await supabase
      .from('registrations')
      .select('*')
      .not('category', 'ilike', '%NST%');

    const generalList = dbGeneral || [];
    const generalGatewayRows: Array<{
      buyerName: string;
      email: string;
      phone: string;
      amount: number;
      race: string;
      custId: string;
      txnId: string;
    }> = [];

    let nstPaidFromGateway = 0;

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
        email.includes('e26b') ||
        email.includes('e25b') ||
        nstEmailSet.has(email) ||
        nstNameSet.has(buyerName.toLowerCase().replace(/\s+/g, ' '));

      if (isNst) {
        const nstMatch = (nstStudents || []).find(n =>
          (n.email || '').toLowerCase().trim() === email ||
          `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === buyerName.toLowerCase().replace(/\s+/g, ' ')
        );
        if (nstMatch) {
          await supabase.from('registrations').update({
            payment_status: 'paid',
            amount: amount || 149,
            race_type: amount >= 149 ? 'Competitive 5K' : 'Non-Competitive Joy 5K',
            razorpay_order_id: custId || 'GATEWAY',
            razorpay_payment_id: txnId || 'GATEWAY',
            phone: phone && phone.length >= 10 ? phone : undefined,
          }).eq('id', nstMatch.id);
          nstPaidFromGateway++;
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

    let generalPaidCount = 0;
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
        generalPaidCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Gateway Sync: Reconciled ${nstPaidFromGateway} NST payments and ${generalPaidCount} General Public payments.`,
      nstPaid: nstPaidFromGateway,
      generalPaid: generalPaidCount,
      totalGatewayRows: rows.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/sync/gateway:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
