import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: dbGeneral } = await supabase.from('registrations').select('*').not('category', 'ilike', '%NST%').order('created_at', { ascending: false });

const seenEmails = new Set();
const toDeleteIds = [];

for (const gen of dbGeneral) {
  const email = (gen.email || '').toLowerCase().trim();
  if (!email) continue;

  if (seenEmails.has(email)) {
    toDeleteIds.push(gen.id);
  } else {
    seenEmails.add(email);
  }
}

if (toDeleteIds.length > 0) {
  console.log(`Deleting ${toDeleteIds.length} duplicate general registration rows...`);
  await supabase.from('registrations').delete().in('id', toDeleteIds);
}

const { data: cleanGeneral } = await supabase.from('registrations').select('*').not('category', 'ilike', '%NST%');
console.log(`Clean Unique General Public Runners in DB: ${cleanGeneral.length}`);

