import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: nst } = await supabase.from('registrations').select('*').ilike('category', '%NST%');

const unmatched = nst.filter(r => r.razorpay_order_id === 'unknown' || !r.razorpay_order_id);
console.log(`Unmatched Gateway Students (${unmatched.length}):`);
unmatched.forEach(u => {
  console.log(`[${u.bib_number}] ${u.first_name} ${u.last_name} | Email: ${u.email} | Amount: ${u.amount} | Race: ${u.race_type} | Drive Link: ${u.emergency_name}`);
});

