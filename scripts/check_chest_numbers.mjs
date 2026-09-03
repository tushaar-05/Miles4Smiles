import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: gen } = await supabase.from('registrations').select('chest_number, bib_number, first_name, last_name');
console.log('General public chest numbers:', gen.map(g => `${g.chest_number} (${g.bib_number})`));

