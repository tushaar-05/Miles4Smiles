import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const unverifiedEmails = [
  'birarisoham70@gmail.com',
  'my1555552@gmail.com',
  'riya1503235@email.com',
  'mukul.kumar10k@gmail.com',
  'e25b000669@adypu.edu.in'
];

for (const email of unverifiedEmails) {
  const { data, error } = await supabase
    .from('registrations')
    .update({
      payment_status: 'pending',
      amount: 0,
      race_type: 'Pending Payment',
      emergency_name: '—', // No payment proof
      razorpay_order_id: 'unknown',
      razorpay_payment_id: 'unknown'
    })
    .eq('email', email)
    .select();

  if (error) console.error(`Error updating ${email}:`, error);
  else console.log(`Updated ${email}:`, data.map(d => ({ name: `${d.first_name} ${d.last_name}`, status: d.payment_status, amount: d.amount, race: d.race_type, proof: d.emergency_name })));
}

