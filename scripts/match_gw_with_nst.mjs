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
  customerId: r[1]?.trim(),
  txnId: r[2]?.trim(),
  buyerName: r[4]?.trim(),
  email: r[5]?.trim().toLowerCase(),
  phone: r[6]?.trim(),
  category: r[10]?.trim(),
  price: parseFloat(r[11]) || 0,
  amount: parseFloat(r[12]) || 0,
}));

console.log('Total gateway rows:', gwRows.length);
console.log('Price distribution in Gateway:');
const priceCounts = {};
gwRows.forEach(g => {
  priceCounts[g.price] = (priceCounts[g.price] || 0) + 1;
});
console.log(priceCounts);

