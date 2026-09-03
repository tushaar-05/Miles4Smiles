import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const { data: nstStudents } = await supabase.from('registrations').select('*').ilike('category', '%NST%').order('bib_number', { ascending: true });

console.log(`Total NST Students in DB: ${nstStudents.length}`);

let missingProof = 0;
let competitive = 0;
let nonCompetitive = 0;

for (const s of nstStudents) {
  const hasDrive = s.emergency_name && s.emergency_name.startsWith('http');
  if (!hasDrive) missingProof++;
  if (s.race_type?.toLowerCase().includes('comp') && !s.race_type?.toLowerCase().includes('non')) {
    competitive++;
  } else {
    nonCompetitive++;
  }
}

console.log(`Students with Google Drive Proof: ${nstStudents.length - missingProof} / ${nstStudents.length}`);
console.log(`Competitive 5K (₹149): ${competitive}`);
console.log(`Non-Competitive Joy 5K (₹99): ${nonCompetitive}`);

const vansh = nstStudents.find(s => s.first_name.toLowerCase().includes('vansh') || s.email.includes('0824'));
console.log('Vansh record:', {
  name: `${vansh.first_name} ${vansh.last_name}`,
  email: vansh.email,
  bib: vansh.bib_number,
  chest: vansh.chest_number,
  amount: vansh.amount,
  race_type: vansh.race_type,
  proof: vansh.emergency_name,
});

