import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: all } = await supabase.from('registrations').select('*');

console.log(`Total database records: ${all.length}`);

const dummyPatterns = ['1234567890', '9876543210', '0000000000', 'test@', 'example.com', 'dummy'];

let issuesFound = [];

all.forEach(r => {
  const isDummyPhone = dummyPatterns.some(p => r.phone?.includes(p) || r.emergency_phone?.includes(p));
  const isDummyEmail = dummyPatterns.some(p => r.email?.includes(p));
  if (isDummyPhone || isDummyEmail) {
    issuesFound.push({ id: r.id, name: `${r.first_name} ${r.last_name}`, phone: r.phone, email: r.email });
  }
});

if (issuesFound.length === 0) {
  console.log('✅ Integrity check passed: 0 placeholder/dummy values in database.');
} else {
  console.log('⚠️ Issues found:', issuesFound);
}

