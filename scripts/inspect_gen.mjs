import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: all } = await supabase.from('registrations').select('category, bib_number, first_name, last_name, email, phone').not('category', 'ilike', '%NST%');
console.log('General participants:', all.map((g, i) => `[${i+1}] ${g.bib_number}: ${g.first_name} ${g.last_name} (${g.email})`));

