import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const generalGateway = [
  { buyerName: 'Agam', email: 'agam.makhija07@gmail.com', phone: '8830758831', amount: 149, race: 'Competitive 5K', custId: 'W8G0ASE2', txnId: 'USPZNN9A' },
  { buyerName: 'vishwa solanki', email: 'vissolanki121@gmail.com', phone: '9574501741', amount: 99, race: 'Non-Competitive 5K', custId: 'JA1KCCG9', txnId: 'GBO7DWXV' },
  { buyerName: 'Mohammad kothi', email: 'mohammadkothi012@gmail.com', phone: '8401677720', amount: 298, race: 'Non-Competitive 5K', custId: '25UPJ0WR', txnId: '0BKJI04W' },
  { buyerName: 'Pragun', email: 'coolprag.07@gmail.com', phone: '9675801503', amount: 249, race: 'Competitive 5K', custId: 'CHB48BME', txnId: '58RQH2PS' },
  { buyerName: 'Venkata uday karamsetty', email: 'uday500027@gmail.com', phone: '9246117041', amount: 249, race: 'Competitive 5K', custId: '1SDWPKZ4', txnId: 'LTUINZHO' },
  { buyerName: 'Tanmay Jadhav', email: 'tanmayjadhav1018@gmail.com', phone: '8451839557', amount: 249, race: 'Competitive 5K', custId: '0A8OFRHX', txnId: 'HKXHONN3' },
  { buyerName: 'Shree waikar', email: 'shreewaikar07@gmail.com', phone: '9673606265', amount: 249, race: 'Competitive 5K', custId: 'WR1XKWJS', txnId: 'UO16WYTM' },
  { buyerName: 'Manthan Gedam', email: 'manthangedam22@gmail.com', phone: '9552290212', amount: 249, race: 'Competitive 5K', custId: 'X9VPYUYM', txnId: '76ON255K' },
  { buyerName: 'SAHASRA', email: 'sahasrab1407@gmail.com', phone: '9082216092', amount: 149, race: 'Non-Competitive 5K', custId: 'ILEAQKBW', txnId: '8AS7EF0U' },
  { buyerName: 'Shubham Pandhari Dudile', email: 'shubhamdudile56@gmail.com', phone: '9875799088', amount: 249, race: 'Competitive 5K', custId: '98I8RMRM', txnId: '5C8TWOR4' },
  { buyerName: 'Shreeshal Ghodekar', email: 'shreeshalgs@gmail.com', phone: '7666717543', amount: 149, race: 'Non-Competitive 5K', custId: 'K75V55BA', txnId: 'V22WCAQ0' },
  { buyerName: 'Tanmay Kandalkar', email: 'tanmayworking123@gmail.com', phone: '9404790071', amount: 249, race: 'Competitive 5K', custId: 'OVVYSRYJ', txnId: 'RRO63ESS' },
  { buyerName: 'Sarvesh', email: 'sarvesh231@gmail.com', phone: '9762664336', amount: 249, race: 'Competitive 5K', custId: 'ZNTP54NQ', txnId: 'HHPBUPU3' },
  { buyerName: 'Meghna Devchoudhury', email: 'meghnalinkx@gmail.com', phone: '7899862512', amount: 149, race: 'Non-Competitive 5K', custId: 'OCAIQNIO', txnId: 'SG0GOBUN' },
  { buyerName: 'riya', email: 'riya1503235@gmail.com', phone: '8440076235', amount: 149, race: 'Competitive 5K', custId: 'JE7QEQUN', txnId: 'DN52IL15' },
  { buyerName: 'Stuti Mannurkar', email: 'stutism3@gmail.com', phone: '9482416399', amount: 149, race: 'Non-Competitive 5K', custId: 'FLDVSTWX', txnId: 'E1X2W8N1' },
  { buyerName: 'Deev jethwa', email: 'deev.jethwa@gmail.com', phone: '9724130672', amount: 149, race: 'Competitive 5K', custId: '3ZC289K4', txnId: 'WRPT8R7J' },
  { buyerName: 'Gautam Bobade', email: 'gautambobade7@gmail.com', phone: '8962577474', amount: 249, race: 'Competitive 5K', custId: '8R6IOZ71', txnId: '3KH2IIM7' },
  { buyerName: 'Krishna Singh Thakur', email: 'krishnaiitdelhi027@gmail.com', phone: '9303691681', amount: 249, race: 'Competitive 5K', custId: 'OF0FR7P5', txnId: 'SA5SA1YH' },
  { buyerName: 'Adarsh Kumar Naik', email: 'adarshnk2009@gmail.com', phone: '7327816197', amount: 249, race: 'Competitive 5K', custId: 'V8IXMKMH', txnId: '9BUW8K55' },
  { buyerName: 'Smit Barad', email: 'barads480@gmail.com', phone: '7016894495', amount: 249, race: 'Competitive 5K', custId: 'HVRCF93W', txnId: '39KM50CD' },
  { buyerName: 'Dhyan Patel', email: 'dhyanpatel0221@gmail.com', phone: '7383808196', amount: 149, race: 'Non-Competitive 5K', custId: 'A7DG0OSY', txnId: 'D58XMKQC' },
  { buyerName: 'Honey kumar', email: 'honeysayswork@gmail.com', phone: '9905020390', amount: 99, race: 'Non-Competitive 5K', custId: 'WT5QNMTE', txnId: 'CUIZPIIZ' }
];

const { data: dbGeneral } = await supabase.from('registrations').select('*').not('category', 'ilike', '%NST%');

console.log(`Current General Registrations in DB: ${dbGeneral.length}`);

// Match each general gateway record
let matchedInDb = 0;
let notInDb = [];

for (const gw of generalGateway) {
  const match = dbGeneral.find(d => 
    d.email.toLowerCase().trim() === gw.email ||
    d.phone.includes(gw.phone.slice(-10)) ||
    (d.first_name + ' ' + d.last_name).toLowerCase().trim() === gw.buyerName.toLowerCase().trim()
  );
  if (match) {
    matchedInDb++;
  } else {
    notInDb.push(gw);
  }
}

console.log(`Matched with existing DB records: ${matchedInDb} / ${generalGateway.length}`);
if (notInDb.length > 0) {
  console.log('Not yet in DB (need to insert):', notInDb);
}

