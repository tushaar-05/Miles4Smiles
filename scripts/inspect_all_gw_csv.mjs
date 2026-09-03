import fs from 'fs';

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      let val = match[1];
      if (val === undefined) break;
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val);
      if (regex.lastIndex >= line.length) break;
    }
    results.push(matches);
  }
  return results;
}

const gatewayCSV = fs.readFileSync('/Users/tushar/.gemini/antigravity-ide/brain/a87b3575-16eb-4ae5-a8dc-48307fc93ee3/.user_uploaded/media_1788426107149.csv', 'utf8');
const gwRows = parseCSV(gatewayCSV).map(r => ({
  customer_id: r[0]?.trim(),
  name: r[1]?.trim(),
  email: r[2]?.trim().toLowerCase(),
  phone: r[3]?.trim(),
  amount: parseFloat(r[4]) || 0,
  date: r[5]?.trim(),
  status: r[6]?.trim(),
  txn_id: r[7]?.trim(),
}));

console.log('Total gateway transactions:', gwRows.length);
console.log('Sample gateway transactions:');
gwRows.slice(0, 10).forEach(g => console.log(g));

