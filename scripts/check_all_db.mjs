import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: allRecords } = await supabase.from('registrations').select('*');
console.log('Total records currently in Supabase:', allRecords.length);

const nst = allRecords.filter(r => (r.category || '').toLowerCase().includes('nst'));
const gen = allRecords.filter(r => !(r.category || '').toLowerCase().includes('nst'));

console.log(`NST in DB: ${nst.length}`);
console.log(`General in DB: ${gen.length}`);

