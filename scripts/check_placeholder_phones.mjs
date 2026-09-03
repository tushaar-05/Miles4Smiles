import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data } = await supabase.from('registrations').select('first_name, last_name, email, phone, bib_number').eq('phone', '9876543210');
console.log('Students with 9876543210 placeholder:');
data.forEach(d => console.log(`${d.bib_number}: ${d.first_name} ${d.last_name} (${d.email})`));

