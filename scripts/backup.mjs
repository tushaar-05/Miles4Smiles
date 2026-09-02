import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve('.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://keaxuybyexjmmcmnoboc.supabase.co';
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseKey) {
  console.error('❌ Supabase API key not found in .env.local');
  process.exit(1);
}

console.log('🔄 Fetching complete database backup from Supabase...');

const url = `${supabaseUrl}/rest/v1/registrations?select=*&order=created_at.desc`;

fetch(url, {
  headers: {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  },
})
  .then(async res => {
    if (!res.ok) {
      const err = await res.text();
      console.error('❌ Backup failed with status', res.status, err);
      process.exit(1);
    }

    const data = await res.json();
    const backupDir = path.resolve('backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonFile = path.join(backupDir, `registrations_backup_${timestamp}.json`);
    const csvFile = path.join(backupDir, `registrations_backup_${timestamp}.csv`);

    // 1. Save JSON
    fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));

    // 2. Save CSV
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers
            .map(h => {
              const val = row[h] === null || row[h] === undefined ? '' : String(row[h]).replace(/"/g, '""');
              return `"${val}"`;
            })
            .join(',')
        ),
      ];
      fs.writeFileSync(csvFile, csvRows.join('\n'));
    }

    console.log(`\n🎉 Backup Completed Successfully! (${data.length} total registrations)`);
    console.log(`📁 JSON Backup: backups/${path.basename(jsonFile)}`);
    console.log(`📊 CSV (Excel) Backup: backups/${path.basename(csvFile)}\n`);
  })
  .catch(err => {
    console.error('❌ Backup Error:', err);
    process.exit(1);
  });
