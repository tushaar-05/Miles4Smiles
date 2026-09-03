import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

await supabase.from('registrations').update({
  payment_status: 'paid',
  amount: 149,
  race_type: 'Competitive 5K',
  phone: '8440076235',
  razorpay_order_id: 'JE7QEQUN',
  razorpay_payment_id: 'DN52IL15'
}).ilike('email', '%riya1503235%');

console.log('Updated Riya Agrawal in NST.');

