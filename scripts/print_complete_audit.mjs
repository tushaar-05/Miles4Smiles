import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: all } = await supabase.from('registrations').select('*').order('created_at', { ascending: true });

const nst = all.filter(r => (r.category || '').toLowerCase().includes('nst'));
const gen = all.filter(r => !(r.category || '').toLowerCase().includes('nst'));

console.log('================================================================');
console.log('🏆 COMPLETE 100% RECONCILED DATABASE AUDIT');
console.log('================================================================');

console.log(`\n🎓 NST STUDENTS & FACULTY:`);
console.log(`- Total Students: ${nst.length}`);
console.log(`- Paid: ${nst.filter(r => r.payment_status === 'paid').length}`);
console.log(`- Pending (No Proof / Unpaid): ${nst.filter(r => r.payment_status === 'pending').length}`);
console.log(`- Competitive 5K (₹149): ${nst.filter(r => r.payment_status === 'paid' && r.race_type.includes('Comp')).length}`);
console.log(`- Non-Competitive Joy 5K (₹99 / ₹0): ${nst.filter(r => r.payment_status === 'paid' && !r.race_type.includes('Comp')).length}`);
console.log(`- Total NST Revenue: ₹${nst.filter(r => r.payment_status === 'paid').reduce((a, c) => a + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}`);

console.log(`\n🌍 GENERAL PUBLIC AUDIENCE:`);
console.log(`- Total Registered: ${gen.length}`);
console.log(`- Paid in Gateway: ${gen.filter(r => r.payment_status === 'paid').length}`);
console.log(`- Pending: ${gen.filter(r => r.payment_status === 'pending').length}`);
console.log(`- Competitive 5K (₹249 / ₹149): ${gen.filter(r => r.payment_status === 'paid' && r.race_type.includes('Comp')).length}`);
console.log(`- Non-Competitive Joy 5K (₹149 / ₹99 / ₹298): ${gen.filter(r => r.payment_status === 'paid' && !r.race_type.includes('Comp')).length}`);
console.log(`- Total General Revenue: ₹${gen.filter(r => r.payment_status === 'paid').reduce((a, c) => a + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}`);

console.log(`\n💰 GRAND TOTAL SUMMARY:`);
console.log(`- Combined Registrations: ${all.length}`);
console.log(`- Combined Confirmed / Paid: ${all.filter(r => r.payment_status === 'paid').length}`);
console.log(`- Combined Total Revenue: ₹${all.filter(r => r.payment_status === 'paid').reduce((a, c) => a + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}`);

console.log('\n--- NST Pending Students ---');
nst.filter(r => r.payment_status === 'pending').forEach((s, i) => {
  console.log(`[${i+1}] ${s.first_name} ${s.last_name} (${s.email}) - URN: ${s.city}`);
});

console.log('\n--- General Public Paid Runners ---');
gen.filter(r => r.payment_status === 'paid').forEach((g, i) => {
  console.log(`[${i+1}] ${g.bib_number} | ${g.first_name} ${g.last_name} | ${g.email} | ${g.phone} | ₹${g.amount} | ${g.race_type} | Cust: ${g.razorpay_order_id} | Txn: ${g.razorpay_payment_id}`);
});

