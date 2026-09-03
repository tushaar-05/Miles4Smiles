import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

const rawCsv = `Email Received Date,Customer ID,Transaction ID,Transaction Date & Time,Buyer Name,Email ID,Contact No,Event Name,Event Dates,Quantity Purchased,Category,Price Per Ticket,Total Amount Transferred
02-Sep-2026 10:53,R1TACKMB,9ZK3J1MM,"Sept. 2, 2026, 10:53 a.m.",Narmit Kumar,narmit30072007@gmail.com,7015421849,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 10:54,RC6094YO,5AUBMHGD,"Sept. 2, 2026, 10:54 a.m.",VEER PRATAP SINGH,veer230022@gmail.com,7869866822,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 10:59,31GVPFNK,08UA7467,"Sept. 2, 2026, 10:58 a.m.",Dhruv Jagtap,dhruvjagtap269@gmail.com,7730043888,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 12:23,W8G0ASE2,USPZNN9A,"Sept. 2, 2026, 12:23 p.m.",Agam,agam.makhija07@gmail.com,8830758831,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 12:26,JA1KCCG9,GBO7DWXV,"Sept. 2, 2026, 12:26 p.m.",vishwa solanki,vissolanki121@gmail.com,9574501741,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 12:36,25UPJ0WR,0BKJI04W,"Sept. 2, 2026, 12:34 p.m.",Mohammad kothi,mohammadkothi012@gmail.com,8401677720,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",2,Non-Competitive 5K,149.00,298.00
02-Sep-2026 12:37,M1QDWZ97,EXF4AVO1,"Sept. 2, 2026, 12:36 p.m.",DHEERAJ KUMAR,dhirajdk6121@gmail.com,7903774281,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 14:17,CHB48BME,58RQH2PS,"Sept. 2, 2026, 2:13 p.m.",Pragun,coolprag.07@gmail.com,9675801503,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 14:43,MU5RFQPV,Y7KOS4BO,"Sept. 2, 2026, 2:42 p.m.",Alok Gupta,alokcbn@gmail.com,6394739623,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 14:57,1SDWPKZ4,LTUINZHO,"Sept. 2, 2026, 2:56 p.m.",Venkata uday karamsetty,uday500027@gmail.com,9246117041,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 15:00,0A8OFRHX,HKXHONN3,"Sept. 2, 2026, 3 p.m.",Tanmay Jadhav,tanmayjadhav1018@gmail.com,8451839557,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 15:03,TQCEX1CA,Y8L91R7K,"Sept. 2, 2026, 3:02 p.m.",Stavan Somaiya,stavansomaiya@gmail.com,9104759176,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 15:09,WR1XKWJS,UO16WYTM,"Sept. 2, 2026, 3:07 p.m.",Shree waikar,shreewaikar07@gmail.com,9673606265,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 15:10,X9VPYUYM,76ON255K,"Sept. 2, 2026, 3:08 p.m.",Manthan Gedam,manthangedam22@gmail.com,9552290212,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 15:42,WC8WFGH9,UUTQNT64,"Sept. 2, 2026, 3:42 p.m.",Archita Pandey,e26b07f0636@adypu.edu.in,9136115819,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 15:44,JOTVBDFE,CJZZGSCV,"Sept. 2, 2026, 3:44 p.m.",Nitish singla,e26b07f0587@adypu.edu.in,7340803110,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 15:45,L01T9NH9,8O0WE0FE,"Sept. 2, 2026, 3:44 p.m.",Atharav balotra,e26b07f0585@adypu.edu.in,8968573775,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 15:46,KYLCGG7F,LW591PFT,"Sept. 2, 2026, 3:46 p.m.",Anuradha Gaur,e26b07f0632@adypu.edu.in,7683046084,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 15:51,RVPIGKHO,98E6QDSV,"Sept. 2, 2026, 3:51 p.m.",Shreya Sinha,shreyasinha384@gmail.com,7414917468,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 15:54,HN0FCQ6X,LGBA9M3K,"Sept. 2, 2026, 3:53 p.m.",Priya Hisariya,priyahisariya494@gmail.com,9142591337,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
02-Sep-2026 16:05,ILEAQKBW,8AS7EF0U,"Sept. 2, 2026, 4:04 p.m.",SAHASRA,sahasrab1407@gmail.com,9082216092,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
02-Sep-2026 16:49,98I8RMRM,5C8TWOR4,"Sept. 2, 2026, 4:48 p.m.",Shubham Pandhari Dudile,shubhamdudile56@gmail.com,9875799088,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 19:25,55J5BBGV,JPC87U8V,"Sept. 2, 2026, 7:24 p.m.",NISHANT EKKA,nishantekka2007@gmail.com,9339141798,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 20:53,K75V55BA,V22WCAQ0,"Sept. 2, 2026, 8:53 p.m.",Shreeshal Ghodekar,shreeshalgs@gmail.com,7666717543,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
02-Sep-2026 21:08,OVVYSRYJ,RRO63ESS,"Sept. 2, 2026, 9:07 p.m.",Tanmay Kandalkar,tanmayworking123@gmail.com,9404790071,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 21:27,GUIS8QQC,004CS2ZG,"Sept. 2, 2026, 9:26 p.m.",Sneha Singh,e26b07f0590@adypu.edu.in,8735850635,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 21:50,Y8GCNHVF,ROO0H7OW,"Sept. 2, 2026, 9:50 p.m.",Ali Raza,aliraza8806.ar@gmail.com,7607462978,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 21:57,56IOP0D1,T4N3OL0G,"Sept. 2, 2026, 9:55 p.m.",Parth Kadukar,parthkadukar146720@gmail.com,9270505165,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:02,NCW4TYW5,RD07IV1T,"Sept. 2, 2026, 10:02 p.m.",Sushant Gupta,sushantgupta0676@gmail.com,8825782907,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:03,CO3MGHP6,XFBE5V6C,"Sept. 2, 2026, 10:02 p.m.",Himanshu Parmarthi,himanshuparmarthi1@gmail.com,8920523643,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:11,ZNTP54NQ,HHPBUPU3,"Sept. 2, 2026, 10:11 p.m.",Sarvesh,sarvesh231@gmail.com,9762664336,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
02-Sep-2026 22:22,OCAIQNIO,SG0GOBUN,"Sept. 2, 2026, 10:21 p.m.",Meghna Devchoudhury,meghnalinkx@gmail.com,7899862512,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
02-Sep-2026 22:28,JE7QEQUN,DN52IL15,"Sept. 2, 2026, 10:28 p.m.",riya,riya1503235@gmail.com,8440076235,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:31,WJLOSW7O,LAR5EVZ3,"Sept. 2, 2026, 10:30 p.m.",Divyanshi Yadav,e26b07f0662@adypu.edu.in,9555781911,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:37,FLDVSTWX,E1X2W8N1,"Sept. 2, 2026, 10:37 p.m.",Stuti Mannurkar,stutism3@gmail.com,9482416399,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
02-Sep-2026 22:52,41SMH96B,1QKMSP41,"Sept. 2, 2026, 10:51 p.m.",Utkarsh,e26b07f0710@adypu.edu.in,9157154736,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 22:55,U6BNK9F5,U5NS0ARP,"Sept. 2, 2026, 10:54 p.m.",Aniket Kumar Nishad,aniketkn28@gmail.com,7718862573,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:01,Q4BGEGRZ,RUFKHUQC,"Sept. 2, 2026, 11 p.m.",Anubhav Rai,e26b07f083@adypu.edu.in,9996652008,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:09,LG4HU3OJ,6NL27JI4,"Sept. 2, 2026, 11:09 p.m.",Dhairya Tiwari,dhairyatiwariwork209@gmail.com,9981390626,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:12,URD8247V,ACS3HAES,"Sept. 2, 2026, 11:11 p.m.",Prince Bhamla,bhamlaprince05@gmail.com,8368944920,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:13,QZONGRR8,AZTYHE1Q,"Sept. 2, 2026, 11:12 p.m.",Aman Dixit,dixitaman117@gmail.com,9322052312,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:15,VZ4E2U24,7BLD2THT,"Sept. 2, 2026, 11:13 p.m.",Mayank sharma,mayanksharma8085ms@gmail.com,8504864666,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
02-Sep-2026 23:18,3ZC289K4,WRPT8R7J,"Sept. 2, 2026, 11:17 p.m.",Deev jethwa,deev.jethwa@gmail.com,9724130672,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 00:16,8R6IOZ71,3KH2IIM7,"Sept. 3, 2026, 12:15 a.m.",Gautam Bobade,gautambobade7@gmail.com,8962577474,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
03-Sep-2026 00:16,0M3SGBOD,QP0BOFK4,"Sept. 3, 2026, 12:15 a.m.",Sara,e26b07f0709@adypu.edu.in,7498310054,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 00:24,OF0FR7P5,SA5SA1YH,"Sept. 3, 2026, 12:23 a.m.",Krishna Singh Thakur,krishnaiitdelhi027@gmail.com,9303691681,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
03-Sep-2026 00:30,SGL9SIKM,1DA07M6S,"Sept. 3, 2026, 12:29 a.m.",Ayaz Mazrun,mazrunayaz4@gmail.com,9484778392,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 00:35,KO85IDM5,O9VAD286,"Sept. 3, 2026, 12:34 a.m.",Mahendi Raza,mahdirazabhojani41@gmail.com,8128201472,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 00:40,EEKLC8DL,NT3KM4D1,"Sept. 3, 2026, 12:40 a.m.",Soham Deshmane,sohamd1033@gmail.com,7276675011,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 01:26,4S95T448,FI195KNY,"Sept. 3, 2026, 1:25 a.m.",Avika Kalraiya,avika.k2008@gmail.com,9755478237,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 02:32,CWE2GGNG,122JDY2R,"Sept. 3, 2026, 2:31 a.m.",Aviral Dwivedi,aviral1343@gmail.com,7388176555,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 06:34,JPRMAUK3,U95VA09I,"Sept. 3, 2026, 6:34 a.m.",Akansha Paliwal,e25b070878@adypu.edu.in,8461813661,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 08:03,ZEL7LJGD,SJG98DKZ,"Sept. 3, 2026, 8:02 a.m.",Sanskar Kesharwani,sanskarkesharwani140@gmail.com,6264049926,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 08:04,JJ6V8EWO,9KCRQDS0,"Sept. 3, 2026, 8:03 a.m.",Vansh,e26b07f0824@adypu.edu.in,9996995156,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 08:21,V8IXMKMH,9BUW8K55,"Sept. 3, 2026, 8:20 a.m.",Adarsh Kumar Naik,adarshnk2009@gmail.com,7327816197,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
03-Sep-2026 08:22,HVRCF93W,39KM50CD,"Sept. 3, 2026, 8:20 a.m.",Smit Barad,barads480@gmail.com,7016894495,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,249.00,249.00
03-Sep-2026 08:51,A7DG0OSY,D58XMKQC,"Sept. 3, 2026, 8:51 a.m.",Dhyan Patel,dhyanpatel0221@gmail.com,7383808196,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
03-Sep-2026 09:07,3T61L9V9,IDPPXT7F,"Sept. 3, 2026, 9:06 a.m.",Tanmaya Verma,verma.tanmaya@gmail.com,7657857071,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 11:31,SJDKBFIT,XQVCEBK1,"Sept. 3, 2026, 11:30 a.m.",sarvesh chavan,sarvesh.chawan1000@gmail.com,7718893599,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 11:31,825QOVHN,QJ7BDNG5,"Sept. 3, 2026, 11:30 a.m.",Jayanta Nath,jollynath.shillong@gmail.com,9436706842,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 11:33,GUC0KGM5,1W2KHZGM,"Sept. 3, 2026, 11:33 a.m.",Swanand Kadam,swanandkadam8061@gmail.com,9983750999,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 11:37,WT5QNMTE,CUIZPIIZ,"Sept. 3, 2026, 11:35 a.m.",Honey kumar,honeysayswork@gmail.com,9905020390,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 11:37,T6Z8CXO4,KZ8L9MEV,"Sept. 3, 2026, 11:36 a.m.",Muskan Sharma,e26b07f0711@adypu.edu.in,7050760699,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 11:45,HS7UL5WJ,BLUO5B2T,"Sept. 3, 2026, 11:39 a.m.",Tanmay Choudhary,tanmaychoudhary.rbt@gmail.com,8265097315,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,99.00,99.00
03-Sep-2026 15:03,GLW8W67Y,MYQ9QSOJ,"Sept. 3, 2026, 3:03 p.m.",Rameez Rahman,e25b071206@adypu.edu.in,9301804524,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00`;

const { data: nstInDb } = await supabase.from('registrations').select('*').ilike('category', '%NST%');
const nstEmailSet = new Set(nstInDb.map(n => (n.email || '').toLowerCase().trim()));
const nstNameSet = new Set(nstInDb.map(n => `${n.first_name} ${n.last_name}`.toLowerCase().trim().replace(/\s+/g, ' ')));

const lines = rawCsv.trim().split('\n').slice(1);
const nstMatched = [];

for (const line of lines) {
  const matches = line.match(/(?:\"([^\"]*)\"|([^\",]+))/g);
  if (!matches || matches.length < 13) continue;
  const clean = matches.map(m => m.replace(/^\"|\"$/g, '').trim());
  const [emailReceived, custId, txnId, txnDateTime, buyerName, email, contactNo, eventName, eventDates, qty, category, price, totalAmt] = clean;
  
  const isNstEmail = nstEmailSet.has(email.toLowerCase().trim()) || email.endsWith('@adypu.edu.in');
  const isNstName = nstNameSet.has(buyerName.toLowerCase().trim().replace(/\s+/g, ' '));
  
  if (isNstEmail || isNstName) {
    nstMatched.push({ buyerName, email, contactNo, custId, txnId, price });
  }
}

console.log(`Matched ${nstMatched.length} NST rows:`);
nstMatched.forEach((n, i) => console.log(`[${i+1}] ${n.buyerName} (${n.email}) - Cust: ${n.custId}, Txn: ${n.txnId}`));

