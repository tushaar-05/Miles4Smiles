import { createClient } from '@supabase/supabase-js';

async function cleanDuplicates() {
  const supabase = createClient(
    'https://keaxuybyexjmmcmnoboc.supabase.co',
    'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
  );

  const { data: records, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !records) {
    console.error('Fetch error:', error);
    return;
  }

  console.log(`Starting cleanup on ${records.length} records...`);

  // Group by phone
  const groups = new Map();
  for (const r of records) {
    const phone = (r.phone || '').replace(/\D/g, '').slice(-10);
    if (!phone) continue;
    if (!groups.has(phone)) groups.set(phone, []);
    groups.get(phone).push(r);
  }

  const idsToDelete = [];

  for (const [phone, group] of groups.entries()) {
    if (group.length > 1) {
      console.log(`\nPhone ${phone} has ${group.length} entries:`);
      
      // Sort group: 'paid' first, then records with known customer_id, then newest
      group.sort((a, b) => {
        if (a.payment_status === 'paid' && b.payment_status !== 'paid') return -1;
        if (b.payment_status === 'paid' && a.payment_status !== 'paid') return 1;
        const aHasCust = a.razorpay_order_id && a.razorpay_order_id !== 'unknown' && !a.razorpay_order_id.startsWith('order_general');
        const bHasCust = b.razorpay_order_id && b.razorpay_order_id !== 'unknown' && !b.razorpay_order_id.startsWith('order_general');
        if (aHasCust && !bHasCust) return -1;
        if (bHasCust && !aHasCust) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      const primary = group[0];
      console.log(`  KEEPING: ${primary.first_name} ${primary.last_name} (ID: ${primary.id}, BIB: ${primary.bib_number}, Status: ${primary.payment_status}, CustID: ${primary.razorpay_order_id})`);

      for (let i = 1; i < group.length; i++) {
        const dup = group[i];
        console.log(`  DELETING DUPLICATE: ${dup.first_name} ${dup.last_name} (ID: ${dup.id}, BIB: ${dup.bib_number}, Status: ${dup.payment_status})`);
        idsToDelete.push(dup.id);
      }
    }
  }

  console.log(`\nTotal duplicate IDs to remove: ${idsToDelete.length}`);

  let deletedCount = 0;
  for (const id of idsToDelete) {
    const { error: delErr } = await supabase.from('registrations').delete().eq('id', id);
    if (!delErr) {
      deletedCount++;
    } else {
      console.error(`Failed to delete ${id}:`, delErr.message);
    }
  }

  console.log(`✓ Cleaned up ${deletedCount} duplicate registrations.`);
  const { data: finalRecs } = await supabase.from('registrations').select('*');
  const paidCount = finalRecs.filter(r => r.payment_status === 'paid').length;
  console.log(`\nFinal Clean Database Status:`);
  console.log(`- Total Unique Registrations: ${finalRecs.length}`);
  console.log(`- Total Paid Registrations: ${paidCount}`);
  console.log(`- Total Pending Registrations: ${finalRecs.length - paidCount}`);
}

cleanDuplicates();
