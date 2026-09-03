import { createClient } from '@supabase/supabase-js';

const nstFormRaw = `Timestamp,Name,Email,URN NUMBER,Gender,Select your preferred t-shirt size for the event:,Weight,Height,Study Year,"Upload the Screenshot of payment

Link: https://easebuzz.in/link/W3PNM ",I understand that the amount fee is non-refundable,Phone Number ,Column 11
02/09/2026 10:55:31,Narmit Kumar,narmit30072007@gmail.com,e26b07f0557,Male,M,62,175,1st,https://drive.google.com/open?id=1kx80kuQA46lkuv7Pd_KU8TJx4gS5UAC3,Yes,,
02/09/2026 10:55:48,VEER PRATAP SINGH,veer230022@gmail.com,E26B07F0609,Male,L,70kg,172cm,1st,https://drive.google.com/open?id=1YuofHUX9h1sQHV6iQ9ce4ZUqTP6GUxIY,Yes,,
02/09/2026 12:24:33,Dhruv Jagtap,e26b07f0782@adypu.edu.in,E26B07F0782,Male,L,76 kg,176 cm,1st,https://drive.google.com/open?id=1--m2X-JtjO0FBRcm1OC708HKW-ZVHfwI,Yes,,
02/09/2026 12:38:03,DHEERAJ ,dhirajdk6121@gmail.com,e26b07f0784,Male,M,65,165cm,1st,https://drive.google.com/open?id=1V2LVlZQ6lvCDZLmi6dSIJm_qOjKqMOAl,Yes,,
02/09/2026 14:46:22,Alok Gupta,alokcbn@gmail.com,E26B07F0573,Male,L,60kg,167 cm ,1st,https://drive.google.com/open?id=1Z2VZumUIIhFwiOep0xOVFaiW09qoI0a1,Yes,,
02/09/2026 15:04:27,Stavan Somaiya,stavansomaiya@gmail.com,,Male,L,74,173,1st,https://drive.google.com/open?id=1GkzL1RHSHDP1kJ4kR4O0RjOVd8oFvNeq,Yes,,
02/09/2026 15:45:42,Nitish singla,e26b07f0587@adypu.edu.in,e26b07f0587,Male,M,60,5.9,1st,https://drive.google.com/open?id=1cD2nSNKhqahLXHUHfGaaeoxtZJlWGvye,Yes,,
02/09/2026 15:47:13,Archita Pandey,e26b07f0636@adypu.edu.in,e26b07f0636,Female,M,50,"5'5""",1st,https://drive.google.com/open?id=1U9zQ9Frmf9J0zv2sGk_LCusVUQnJltB-,Yes,,
02/09/2026 15:47:57,Anuradha Gaur,e26b07f0632@adypu.edu.in,E26b07f0632,Female,S,43,5’5,1st,https://drive.google.com/open?id=1i4wJaUDSWVsm8yGrxgH4MrzVBzsoCfzM,Yes,,
02/09/2026 15:52:30,Atharav Balotra,e26b07f0585@adypu.edu.in,e26b07f0585,Male,M,64,"5'8""",1st,https://drive.google.com/open?id=1oaYaSGMX6Rx1ctNNPN7YFSgGFX4b3rAI,Yes,,
02/09/2026 15:52:48,Shreya Sinha,shreyasinha384@gmail.com,,Female,XL,69,5'4,1st,https://drive.google.com/open?id=1pfl_FvQMmkYRIOYBHc1m4OLtVQMtkHas,Yes,,
02/09/2026 15:55:32,Priya Hisariya ,priyahisariya494@gmail.com,,Female,M,55,5”3,1st,https://drive.google.com/open?id=1yZwEJRWGoT0XAdOtLI8LC_iaACAJQ8Ac,Yes,,
02/09/2026 19:28:02,NISHANT EKKA,nishantekka2007@gmail.com,E26B07F0889,Male,S,48,5.4,1st,https://drive.google.com/open?id=19MBwA1Hi-rQZYcLIwyqvxrthOJtCFkuO,Yes,,
02/09/2026 20:01:47,Dhruv Jagtap,e26b07f0782@adypu.edu.in,e26b07f0782,Male,L,76,176,1st,https://drive.google.com/open?id=1bsi8mR3PT9iDDaCn_ez6E_dMOTNSQ18F,Yes,,
02/09/2026 21:28:41,Sneha Singh,e26b07f0590@adypu.edu.in,E26B07F0590,Female,S,40,137,1st,https://drive.google.com/open?id=12oX1lu0EcnJPACD9qn6xKTEExq8VAXE3,Yes,,
02/09/2026 21:58:52,Parth Kadukar,e25b070890@adypu.edu.in,E25B070890,Male,M,57,175,2nd,https://drive.google.com/open?id=1pUe-54Cg8YBYJDsR6P02mtUNxhO3FyV7,Yes,,
02/09/2026 22:04:08,Sushant Gupta,e25b070925@adypu.edu.in,E25b070925,Male,M,57,169,2nd,https://drive.google.com/open?id=11AGfXfID9jnLUObKJTeD8gRUlSX5ygKH,Yes,,
02/09/2026 22:04:58,Himanshu Parmarthi,e25b070820@adypu.edu.in,E25B070820,Male,M,60.5,170cm,2nd,https://drive.google.com/open?id=1IYzFZ8usplX70wsBnuKwYj1izgMXahJQ,Yes,,
02/09/2026 22:09:23,Ali Raza,aliraza8806.ar@gmail.com,e26b07f0644@adypu.edu.in,Male,L,63,175cm,1st,https://drive.google.com/open?id=19SwtQdvuMNEDg3-U18hVvHkcNE6D1A2c,Yes,,
02/09/2026 22:31:09,riya agrawal,riya1503235@email.com,E26B07F0806,Female,S,40,5'1,1st,https://drive.google.com/open?id=10BgzTOBgBB0oG_yctg5DZ0CJGWairU4z,Yes,,
02/09/2026 22:56:01,Utkarsh ,e26b07f0710@adypu.edu.in,e26b07f0710,Male,XL,65,185,1st,https://drive.google.com/open?id=1Qua9VaChIITOAUMqrNUKIhHysK5Ga3FZ,Yes,,
02/09/2026 23:01:36,Aniket Kumar Nishad ,e26b07f0789@adypu.edu.in,e26b07f0789,Male,XL,72,162,1st,https://drive.google.com/open?id=1isVdKbTRqjiMJ8CUxekWyZoofgVXclzP,Yes,,
02/09/2026 23:04:23,Anubhav Rai,e26b07f0843@adypu.edu.in,e26b07f0843,Male,XL,95,6ft,1st,https://drive.google.com/open?id=1_fYpI3L4HKSQ8DxPoC2ilr7y__B8iJ3C,Yes,,
02/09/2026 23:11:39,Dhairya Tiwari ,e26b07f1062@adypu.edu.in,e26b07f1062,Male,XL,73,181,1st,https://drive.google.com/open?id=1Evx6JALZ4tHSH_LocY4QBf2N-FBYf-fs,Yes,,
02/09/2026 23:17:30,Mayank sharma,mayanksharma8085ms@gmail.com,,Male,L,65,183cm,1st,https://drive.google.com/open?id=138LTaaDMTLNicH6duWKTY0B9I3QIuUOR,Yes,,
02/09/2026 23:21:20,Prince Bhamla,bhamlaprince05@gmail.com,,Male,XL,70,179,1st,https://drive.google.com/open?id=1h-WQDDr-bpyjjUIg4Mq4xQTfijgAkVhR,Yes,,
02/09/2026 23:28:51,Aman Dixit,dixitaman117@gmail.com,E26B07F0664,Male,M,47,172,1st,https://drive.google.com/open?id=1HA6JotwOGqcE9PQiXbMU0SGalsLvWYsI,Yes,,
03/09/2026 00:17:57,Sara Kottawar ,e26b07f0709@adypu.edu.in,E26b07f0709,Female,S,45,5’2,1st,https://drive.google.com/open?id=1n41Dn3is5ziimthLA638a7MKuXULfMtH,Yes,,
03/09/2026 00:31:34,Ayaz Mazrun,mazrunayaz4@gmail.com,E26B070657,Male,S,48,170 cm,1st,https://drive.google.com/open?id=1PX6GaE9oaK-aPVXXoWfjpa547Y7wYc5s,Yes,,
03/09/2026 00:37:02,Mahendi Raza,mahdirazabhojani41@gmail.com,E26B07F0541,Male,S,63,169,1st,https://drive.google.com/open?id=1BeKdnZowp0_RfhNFKUdzDCwDA0W68wzG,Yes,,
03/09/2026 00:45:16,Soham Deshmane ,e26b07f0876@adypu.edu.in,E26B07F0876 ,Male,M,50,,1st,https://drive.google.com/open?id=1BhuPw7qu-X0A8abZfPusIpi5AJfVF56q,Yes,,
03/09/2026 01:27:18,Avika Kalraiya,avika.k2008@gmail.com,E26B07F0653,Female,S,58,164cm,1st,https://drive.google.com/open?id=1Jm5fC-jry5_HTyliV-qpOLSlbic6Jorc,Yes,,
03/09/2026 02:33:22,Aviral Dwivedi,aviral1343@gmail.com,E25B070624,Male,M,64,5’8”,2nd,https://drive.google.com/open?id=1quJtECafFyDWuUNaI5PRn_Jv__GyIzRM,Yes,,
03/09/2026 06:35:57,Akansha Paliwal,e25b070878@adypu.edu.in,E25B070878,Female,M,46,5'4,2nd,https://drive.google.com/open?id=1w-mR6VD6kyBoXjy-3jxJWmrjXWFruwsL,Yes,,
03/09/2026 08:04:37,Sanskar Kesharwani,sanskarkesharwani140@gmail.com,E26B07F0594,Male,XL,78,5 10,1st,https://drive.google.com/open?id=136uyMyJryEFo61K7DEK6JftjytvsAWNZ,Yes,,
03/09/2026 08:06:59,Vansh,e26b07f0824@adypu.edu.in,E24B07F0824,Male,XL,78-82,6 feet,1st,https://drive.google.com/open?id=1B_kOX98Dkdz7-IJ4OWJ5N-phMtHtjW1j,Yes,,
03/09/2026 08:48:12,Arham,my1555552@gmail.com,,Male,L,50,"5,11",1st,https://drive.google.com/open?id=1JPi9Kd0ACb9I_AHVV64DiRImF6wV-BNM,Yes,,
03/09/2026 09:09:22,Tanmaya Verma,verma.tanmaya@gmail.com,E26B07f0886,Male,XL,78,,1st,https://drive.google.com/open?id=1E7jjiVYEgZRJQfUEWZQzQ_9MfOgbpBOY,Yes,,
03/09/2026 09:26:48,Mukul Kumar,mukul.kumar10k@gmail.com,E26B07F0838,Male,XXL,87,5'11',1st,https://drive.google.com/open?id=13YCNe1a_EAQ2t9GiApJ1W4jAaLh44Zd9,Yes,,
03/09/2026 11:32:57,Jayanta Nath,jollynath.shillong@gmail.com,E26B07F0656,Male,L,70,170 cm,1st,https://drive.google.com/open?id=1A1XgiOJL9p_Zdacp0G3s7P0z4fl-zFsf,Yes,,
03/09/2026 11:33:24,Sarvesh Chavan,sarvesh.chawan1000@gmail.com,E26B07F0601,Male,L,75,170,1st,https://drive.google.com/open?id=1jn4_QvmxTegyiztsJuNJ9LT_DfrHdF9q,Yes,,
03/09/2026 11:38:34,Muskan Sharma,e26b07f0711@adypu.edu.in,e26b07f0711,Female,S,50,5'3,1st,https://drive.google.com/open?id=1rxdGGrOo36sBkTCqUZYH4zBH7s2c2kv3,Yes,,
03/09/2026 11:53:08,Tanmay Choudhary,tanmaychoudhary.rbt@gmail.com,E26B07F0684,Male,S,51kg,168cm,1st,https://drive.google.com/open?id=1CGPF-M7f5RMygIHMfzaYyOOfZTszZM-g,Yes,,
03/09/2026 12:59:17,Swanand Kadam,swanandkadam8061@gmail.com,,Male,S,55 kg,166 cm,1st,https://drive.google.com/open?id=18bUja93u9D8IHA6kg21-WeADTFElfxOl,Yes,,
03/09/2026 13:07:32,SHREYA SINGH,e25b000669@adypu.edu.in,E25B000669,Female,S,48,5'3,2nd,https://drive.google.com/open?id=1RcNQQESCy8SqR812P1Ol3kd-3kEhKyhU,Yes,,
03/09/2026 14:01:55,soham birari,birarisoham70@gmail.com,E26B07F1066 ,Male,XL,87,182cm,1st,https://drive.google.com/open?id=1Ri-FxsW-v_nUq3ErZgswYYz54EeEQ9lW,Yes,,
03/09/2026 15:10:00,Sousnigdho Das,e26b07f0652@adypu.edu.in,e26b07f0652,Male,XXL,121,5'11,1st,https://drive.google.com/open?id=1hWyZKuJPvcqhbL5BNh4IO1sCTbcrjZGD,Yes,,
03/09/2026 15:23:53,Navee Prajapati,e26b07f0760@adypu.edu.in,e26b07f0760,Female,M,53,5'3,1st,https://drive.google.com/open?id=12UAHRGmoyZ93fpOvPQ2_2_rng4GVtKS3,Yes,9997051504,
03/09/2026 15:42:17,Ayush Gupta,e26b07f0543@adypu.edu.in,,Male,M,61,165cm,1st,https://drive.google.com/open?id=1UipHzxHoCkt-skxT8fQWFwLKjGi4_zx3,Yes,9329552006,
03/09/2026 15:43:58,Chetanya ,e26b07f0651@adypu.edu.in,,Male,L,80,6,1st,https://drive.google.com/open?id=1HxLz_JvxmvpOdj5CpQx91D6NOujrBZps,Yes,8168196326,
03/09/2026 16:06:45,Ajay Mate,mateajay6@gmail.com,E26B07F0576,Male,XL,77,14.732cm,1st,https://drive.google.com/open?id=1YiX1wwZqnJNs5qdUiI5WcDvo1Ju7mJ0B,Yes,7972098811,`;

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = cols[idx] !== undefined ? cols[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

function parseLine(line) {
  const matches = line.match(/(?:\"([^\"]*)\"|([^\",]+))/g);
  return matches ? matches.map(m => m.replace(/^\"|\"$/g, '').trim()) : line.split(',').map(c => c.trim());
}

const formRows = parseCSV(nstFormRaw);
console.log(`Total Form Rows: ${formRows.length}`);

// Let's see all rows by name & email
formRows.forEach((r, idx) => {
  console.log(`[${idx+1}] ${r['Name']} | ${r['Email']} | URN: ${r['URN NUMBER']} | Size: ${r['Select your preferred t-shirt size for the event:']} | Wt: ${r['Weight']} | Ht: ${r['Height']} | Phone: ${r['Phone Number '] || '—'}`);
});

