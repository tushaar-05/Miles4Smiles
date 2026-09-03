import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: all } = await supabase.from('registrations').select('category, bib_number, first_name, last_name');
const nst = all.filter(r => (r.category || '').toLowerCase().includes('nst'));
const gen = all.filter(r => !(r.category || '').toLowerCase().includes('nst'));

console.log(`NST: ${nst.length}`);
console.log(`General: ${gen.length}`);

