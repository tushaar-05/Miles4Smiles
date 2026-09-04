import { getSupabaseAdmin } from '@/lib/supabase/admin';

function parseProperCSV(csvText: string): Record<string, string>[] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentLine.push(currentField);
        currentField = '';
        if (currentLine.some(f => f.trim() !== '')) {
          lines.push(currentLine);
        }
        currentLine = [];
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField);
    if (currentLine.some(f => f.trim() !== '')) {
      lines.push(currentLine);
    }
  }

  if (lines.length === 0) return [];
  const headers = lines[0].map(h => h.trim());
  const records: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined ? row[idx].trim() : '';
    });
    records.push(obj);
  }
  return records;
}

/**
 * Automatically fetches live Google Sheets feeds and reconciles Supabase
 */
export async function syncLiveGoogleSheets() {
  const gatewayUrl = process.env.GOOGLE_SHEET_GATEWAY_CSV_URL;
  const formUrl = process.env.GOOGLE_SHEET_NST_FORM_CSV_URL;

  if (!gatewayUrl && !formUrl) return { synced: false, reason: 'No sheet URLs configured' };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { synced: false, reason: 'No Supabase admin client' };

  try {
    const [gatewayRes, formRes] = await Promise.all([
      gatewayUrl ? fetch(gatewayUrl, { next: { revalidate: 10 } }).then(r => r.ok ? r.text() : '').catch(() => '') : Promise.resolve(''),
      formUrl ? fetch(formUrl, { next: { revalidate: 10 } }).then(r => r.ok ? r.text() : '').catch(() => '') : Promise.resolve(''),
    ]);

    const gatewayRows = gatewayRes ? parseProperCSV(gatewayRes) : [];
    const formRows = formRes ? parseProperCSV(formRes) : [];

    // 1. Fetch current DB state
    const { data: dbAll } = await supabase.from('registrations').select('*');
    const existing = dbAll || [];

    // Helper map for form responses
    const formByEmail = new Map<string, Record<string, string>>();
    const formByPhone = new Map<string, Record<string, string>>();
    const formByName = new Map<string, Record<string, string>>();

    for (const r of formRows) {
      const email = (r['Email'] || '').toLowerCase().trim();
      const phone = (r['Phone Number '] || r['Phone Number'] || '').replace(/\D/g, '').slice(-10);
      const name = (r['Name'] || '').toLowerCase().trim().replace(/\s+/g, ' ');

      if (email) formByEmail.set(email, r);
      if (phone.length === 10) formByPhone.set(phone, r);
      if (name.length > 3) formByName.set(name, r);
    }

    // 2. Process all Gateway rows (the source of truth for paid/confirmed participants)
    if (gatewayRows.length > 0) {
      for (const gw of gatewayRows) {
        const email = (gw['Email ID'] || '').toLowerCase().trim();
        const name = (gw['Buyer Name'] || '').trim();
        const contactNo = (gw['Contact No'] || '').trim();
        const phone10 = contactNo.replace(/\D/g, '').slice(-10);
        const custId = gw['Customer ID'] || '—';
        const txnId = gw['Transaction ID'] || '—';
        const rawAmount = parseFloat(gw['Price Per Ticket'] || gw['Total Amount Transferred'] || gw['Amount'] || '0');
        const amount = isNaN(rawAmount) ? 0 : rawAmount;
        const cat = gw['Category'] || gw['Ticket Category'] || '';
        const isJoy = cat.toLowerCase().includes('non') || cat.toLowerCase().includes('joy') || amount === 0;
        const race = isJoy ? 'Non-Competitive Joy 5K' : 'Competitive 5K';

        // Check if student form response exists
        const formMatch = (email && formByEmail.get(email)) ||
          (phone10.length === 10 && formByPhone.get(phone10)) ||
          (name && formByName.get(name.toLowerCase().replace(/\s+/g, ' ')));

        const isNst =
          email.endsWith('@adypu.edu.in') ||
          email.includes('e26b') ||
          email.includes('e25b') ||
          cat.toLowerCase().includes('nst') ||
          cat.toLowerCase().includes('student') ||
          !!formMatch;

        // Match against existing DB
        const match = existing.find(e =>
          (txnId && txnId !== '—' && (e.razorpay_payment_id === txnId || e.razorpay_order_id === txnId)) ||
          (email && e.email && e.email.toLowerCase().trim() === email) ||
          (phone10.length === 10 && e.phone && e.phone.replace(/\D/g, '').slice(-10) === phone10) ||
          (`${e.first_name} ${e.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === name.toLowerCase().replace(/\s+/g, ' '))
        );

        const formUrn = formMatch ? (formMatch['URN NUMBER'] || '').toUpperCase().trim() : '';
        const formYear = formMatch ? (formMatch['Study Year'] || '1st') : (email.includes('e25') ? '2nd' : '1st');
        const formTShirt = formMatch ? (formMatch['Select your preferred t-shirt size for the event:'] || 'M') : 'M';
        const formWeight = formMatch ? (formMatch['Weight'] || '—') : '—';
        const formHeight = formMatch ? (formMatch['Height'] || '—') : '—';
        const proofKey = formMatch ? Object.keys(formMatch).find(k => k.toLowerCase().includes('screenshot') || k.toLowerCase().includes('proof')) || '' : '';
        const formProof = (proofKey && formMatch ? formMatch[proofKey] : '') || '—';

        if (match) {
          // Update DB record to confirm payment and enrich details
          const updatePayload: Record<string, any> = {
            payment_status: 'paid',
            amount: amount,
            race_type: race,
            razorpay_order_id: custId !== '—' ? custId : match.razorpay_order_id,
            razorpay_payment_id: txnId !== '—' ? txnId : match.razorpay_payment_id,
            category: isNst ? 'NST Student' : (match.category || 'General Public'),
          };

          if (formMatch) {
            if (formTShirt) updatePayload.t_shirt_size = formTShirt;
            if (formWeight !== '—') updatePayload.weight = formWeight;
            if (formHeight !== '—') updatePayload.height = formHeight;
            if (formProof && formProof.startsWith('http')) updatePayload.emergency_name = formProof;
          }

          await supabase.from('registrations').update(updatePayload).eq('id', match.id);
        } else if (name || email) {
          // Insert new confirmed participant from gateway
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || (isNst ? 'Student' : 'Runner');
          const lastName = nameParts.slice(1).join(' ') || '';
          const totalCount = existing.length + 1;
          const chestNumber = isNst ? `NST-${100 + totalCount}` : `${100 + totalCount}`;
          const bibNumber = isNst ? `M4S-NST-${100 + totalCount}` : `M4S-GEN-${100 + totalCount}`;
          const city = isNst ? `NST ADYPU • ${formYear} Year • URN: ${formUrn || '—'}` : 'Pune';

          await supabase.from('registrations').insert({
            first_name: firstName,
            last_name: lastName,
            gender: formMatch ? (formMatch['Gender'] || 'Male') : 'Male',
            blood_group: 'O+',
            dob: isNst ? `${formYear} Year` : '—',
            weight: formWeight,
            height: formHeight,
            t_shirt_size: formTShirt,
            email: email || '—',
            phone: contactNo || '—',
            city: city,
            emergency_name: formProof && formProof.startsWith('http') ? formProof : '—',
            emergency_phone: '—',
            category: isNst ? 'NST Student' : 'General Public',
            race_type: race,
            amount: amount,
            chest_number: chestNumber,
            bib_number: bibNumber,
            razorpay_order_id: custId,
            razorpay_payment_id: txnId,
            payment_status: 'paid',
          });
        }
      }
    }

    return { synced: true };
  } catch (err: any) {
    console.error('Error in syncLiveGoogleSheets:', err);
    return { synced: false, error: err.message };
  }
}
