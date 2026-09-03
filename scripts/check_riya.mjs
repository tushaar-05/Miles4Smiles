import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: nstRiya } = await supabase.from('registrations').select('*').ilike('email', '%riya1503235%');
console.log('NST Riya in DB:', nstRiya);

