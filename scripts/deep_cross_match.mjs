import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

// Let's check the current db records
const { data: dbRecords } = await supabase.from('registrations').select('*');
console.log(`Current DB records in registrations: ${dbRecords.length}`);

