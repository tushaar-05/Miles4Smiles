import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { error } = await supabase
  .from('registrations')
  .update({ phone: '—', emergency_phone: '—' })
  .eq('phone', '9876543210');

if (error) console.error('Update error:', error);
else console.log('Successfully replaced placeholder 9876543210 with —');

