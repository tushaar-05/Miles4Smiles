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
    const existingNst = existing.filter(r => (r.category || '').toLowerCase().includes('nst'));
    const existingGeneral = existing.filter(r => !(r.category || '').toLowerCase().includes('nst'));

    const nstEmailSet = new Set(existingNst.map(n => (n.email || '').toLowerCase().trim()));
    const nstNameSet = new Set(existingNst.map(n => `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ')));

    // 2. Process NST Form Rows (add/update new students)
    if (formRows.length > 0) {
      for (const r of formRows) {
        const email = (r['Email'] || '').toLowerCase().trim();
        const name = (r['Name'] || '').trim();
        const urn = (r['URN NUMBER'] || '').toUpperCase().trim();
        const gender = r['Gender'] || 'Male';
        const tShirt = r['Select your preferred t-shirt size for the event:'] || 'M';
        const weight = r['Weight'] || '—';
        const height = r['Height'] || '—';
        const year = r['Study Year'] || '1st';
        const proofKey = Object.keys(r).find(k => k.toLowerCase().includes('screenshot') || k.toLowerCase().includes('proof')) || '';
        const proof = (proofKey ? r[proofKey] : '') || '—';
        const phone = (r['Phone Number '] || r['Phone Number'] || '').trim();

        if (!name && !email) continue;

        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        const urnFormatted = urn || (email.includes('@adypu.edu.in') ? email.split('@')[0].toUpperCase() : '—');
        const city = `NST ADYPU • ${year} Year • URN: ${urnFormatted}`;

        const match = existingNst.find(e =>
          (email && e.email && e.email.toLowerCase().trim() === email) ||
          (urn && e.city && e.city.toUpperCase().includes(urn)) ||
          (`${e.first_name} ${e.last_name}`.toLowerCase().trim() === name.toLowerCase().trim())
        );

        if (match) {
          // Update if new details present
          await supabase.from('registrations').update({
            t_shirt_size: tShirt || match.t_shirt_size,
            weight: weight !== '—' ? weight : match.weight,
            height: height !== '—' ? height : match.height,
            phone: phone ? phone : match.phone,
            emergency_name: proof && proof.startsWith('http') ? proof : match.emergency_name,
          }).eq('id', match.id);
        } else {
          // Insert new NST student
          const totalNst = existingNst.length + 1;
          const chestNumber = `NST-${100 + totalNst}`;
          const bibNumber = `M4S-NST-${100 + totalNst}`;
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
            phone: phone || '—',
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
          nstEmailSet.add(email);
          nstNameSet.add(name.toLowerCase().replace(/\s+/g, ' '));
        }
      }
    }

    // 3. Process Gateway Rows (reconcile payments)
    if (gatewayRows.length > 0) {
      for (const gw of gatewayRows) {
        const email = (gw['Email ID'] || '').toLowerCase().trim();
        const name = (gw['Buyer Name'] || '').trim();
        const contactNo = gw['Contact No'] || '';
        const custId = gw['Customer ID'] || 'GATEWAY';
        const txnId = gw['Transaction ID'] || 'GATEWAY';
        const rawAmount = parseFloat(gw['Total Amount Transferred'] || gw['Amount'] || '0');
        const amount = isNaN(rawAmount) ? 0 : rawAmount;
        const cat = gw['Ticket Category'] || gw['Category'] || '';
        const isJoy = cat.toLowerCase().includes('non') || cat.toLowerCase().includes('joy') || amount === 0;
        const race = isJoy ? 'Non-Competitive Joy 5K' : 'Competitive 5K';

        const isNst =
          email.endsWith('@adypu.edu.in') ||
          email.includes('e26b') ||
          email.includes('e25b') ||
          nstEmailSet.has(email) ||
          nstNameSet.has(name.toLowerCase().replace(/\s+/g, ' '));

        if (isNst) {
          const nstMatch = existingNst.find(n =>
            (n.email && n.email.toLowerCase().trim() === email) ||
            `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === name.toLowerCase().replace(/\s+/g, ' ')
          );

          if (nstMatch) {
            // Update if pending or if gateway confirms specific payment
            if (nstMatch.payment_status !== 'paid' || (amount > 0 && nstMatch.amount === 0)) {
              await supabase.from('registrations').update({
                payment_status: 'paid',
                amount: amount,
                race_type: race,
                razorpay_order_id: custId,
                razorpay_payment_id: txnId,
                phone: contactNo || nstMatch.phone,
              }).eq('id', nstMatch.id);
            }
          } else if (email || name) {
            // New NST Student registered directly on gateway
            const totalNst = existingNst.length + 1;
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || 'Student';
            const lastName = nameParts.slice(1).join(' ') || '';
            const urn = email.includes('@adypu.edu.in') ? email.split('@')[0].toUpperCase() : '—';
            const year = email.includes('e25') ? '2nd' : '1st';

            await supabase.from('registrations').insert({
              first_name: firstName,
              last_name: lastName,
              gender: 'Male',
              blood_group: 'O+',
              dob: `${year} Year`,
              weight: '—',
              height: '—',
              t_shirt_size: 'M',
              email: email,
              phone: contactNo || '—',
              city: `NST ADYPU • ${year} Year • URN: ${urn}`,
              emergency_name: 'GATEWAY_FREE_TIER',
              emergency_phone: '—',
              category: 'NST Student',
              race_type: race,
              amount: amount,
              chest_number: `NST-${100 + totalNst}`,
              bib_number: `M4S-NST-${100 + totalNst}`,
              razorpay_order_id: custId,
              razorpay_payment_id: txnId,
              payment_status: 'paid',
            });
            nstEmailSet.add(email);
            nstNameSet.add(name.toLowerCase().replace(/\s+/g, ' '));
          }
        } else if (email || name || contactNo) {
          const genMatch = existingGeneral.find(g =>
            (g.email && g.email.toLowerCase().trim() === email) ||
            (contactNo && g.phone && g.phone.replace(/[^0-9]/g, '').slice(-10) === contactNo.slice(-10)) ||
            `${g.first_name} ${g.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ') === name.toLowerCase().replace(/\s+/g, ' ')
          );

          if (genMatch) {
            if (genMatch.payment_status !== 'paid') {
              await supabase.from('registrations').update({
                payment_status: 'paid',
                amount: amount || 249,
                race_type: race,
                razorpay_order_id: custId,
                razorpay_payment_id: txnId,
                phone: contactNo || genMatch.phone,
              }).eq('id', genMatch.id);
            }
          } else {
            // New General Runner registered on Gateway
            const totalGen = existingGeneral.length + 1;
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || 'Runner';
            const lastName = nameParts.slice(1).join(' ') || '';

            await supabase.from('registrations').insert({
              first_name: firstName,
              last_name: lastName,
              gender: 'Male',
              blood_group: 'O+',
              dob: '—',
              weight: '—',
              height: '—',
              t_shirt_size: 'M',
              email: email,
              phone: contactNo || '—',
              city: 'Pune',
              emergency_name: 'GATEWAY',
              emergency_phone: '—',
              category: 'General Public',
              race_type: race,
              amount: amount || (isJoy ? 149 : 249),
              chest_number: `${100 + totalGen}`,
              bib_number: `M4S-GEN-${100 + totalGen}`,
              razorpay_order_id: custId,
              razorpay_payment_id: txnId,
              payment_status: 'paid',
            });
          }
        }
      }
    }

    return { synced: true };
  } catch (err: any) {
    console.error('Error in syncLiveGoogleSheets:', err);
    return { synced: false, error: err.message };
  }
}
