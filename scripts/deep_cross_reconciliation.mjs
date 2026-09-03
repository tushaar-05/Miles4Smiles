import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://keaxuybyexjmmcmnoboc.supabase.co',
  'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl'
);

// We will parse both sheets
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

const gatewayRaw = `Email Received Date,Customer ID,Transaction ID,Transaction Date & Time,Buyer Name,Email ID,Contact No,Event Name,Event Dates,Quantity Purchased,Category,Price Per Ticket,Total Amount Transferred
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
03-Sep-2026 15:03,GLW8W67Y,MYQ9QSOJ,"Sept. 3, 2026, 3:03 p.m.",Rameez Rahman,e25b071206@adypu.edu.in,9301804524,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:07,5YZUHZ4H,DU57HP50,"Sept. 3, 2026, 3:07 p.m.",Sousnigdho Das,e26b07f0652@adypu.edu.in,9830555648,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:10,08L693K5,9MXF75QO,"Sept. 3, 2026, 3:10 p.m.",Chetanya,e26b07f0651@adypu.edu.in,8168196326,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:21,NDBY7QI9,4UV60IQG,"Sept. 3, 2026, 3:21 p.m.",Navee Prajapati,naveeprajapati07@gmail.com,9997051504,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:30,M946UYDS,PGJTWPDR,"Sept. 3, 2026, 3:30 p.m.",Dhruv Makhija,e26b07f0745@adypu.edu.in,7696200104,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:30,Q66LZ9CI,0BCDHG4O,"Sept. 3, 2026, 3:30 p.m.",Purvi Kalpeshkumar Pandey,kppurvi@gmail.com,7028670725,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,149.00,149.00
03-Sep-2026 15:34,UYL03QRJ,B6LCXUMY,"Sept. 3, 2026, 3:34 p.m.",Alok Chauhan,chauhanalok546@gmail.com,6399136559,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Competitive 5K,149.00,149.00
03-Sep-2026 15:41,SJYQTF8P,VRGUOJ6M,"Sept. 3, 2026, 3:41 p.m.",Ayush Gupta,e26b07f0543@adypu.edu.in,9329552006,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 15:48,GRGUIA2G,ZHD6P7VD,"Sept. 3, 2026, 3:47 p.m.",Nikhil Kolhe,e26b07f0599@adypu.edu.in,9371777794,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00
03-Sep-2026 16:04,3QXIVV4L,LK04K312,"Sept. 3, 2026, 4:04 p.m.",Ajay mate,mateajay6@gmail.com,7972098811,Miles for Smiles - 5K Charity Run,"Sep 05, 2026 - Sep 05, 2026",1,Non-Competitive 5K,0.00,0.00`;

function parseProperCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentLine.push(currentField);
        currentField = '';
        if (currentLine.some(f => f.trim() !== '')) {
          lines.push(currentLine);
        }
        currentLine = [];
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField);
    if (currentLine.some(f => f.trim() !== '')) {
      lines.push(currentLine);
    }
  }

  const headers = lines[0].map(h => h.trim());
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined ? row[idx].trim() : '';
    });
    records.push(obj);
  }
  return records;
}

const formParsed = parseProperCSV(nstFormRaw);
const gatewayParsed = parseProperCSV(gatewayRaw);

// 1. De-duplicate Form entries (50 unique students)
const studentMap = new Map();
for (const row of formParsed) {
  const email = (row['Email'] || '').toLowerCase().trim();
  const urn = (row['URN NUMBER'] || '').toUpperCase().trim();
  const name = row['Name'].trim();
  const key = urn || email || name.toLowerCase();

  studentMap.set(key, {
    name,
    email,
    urn,
    gender: row['Gender'],
    t_shirt_size: row['Select your preferred t-shirt size for the event:'] || 'M',
    weight: row['Weight'] || '—',
    height: row['Height'] || '—',
    study_year: row['Study Year'] || '1st',
    proof: row['Upload the Screenshot of payment\n\nLink: https://easebuzz.in/link/W3PNM '] || '—',
    phone: row['Phone Number '] || ''
  });
}

const uniqueStudents = Array.from(studentMap.values());

// Also look for students in Gateway who might not have filled the form (e.g. Rameez Rahman, Dhruv Makhija, Nikhil Kolhe)
const extraNstFromGateway = [];
const studentEmails = new Set(uniqueStudents.map(s => s.email.toLowerCase()).filter(Boolean));
const studentUrns = new Set(uniqueStudents.map(s => s.urn.toLowerCase()).filter(Boolean));
const studentNames = new Set(uniqueStudents.map(s => s.name.toLowerCase().replace(/\s+/g, ' ')));

for (const gw of gatewayParsed) {
  const email = gw['Email ID'].toLowerCase().trim();
  const name = gw['Buyer Name'].trim();
  const nameNorm = name.toLowerCase().replace(/\s+/g, ' ');
  const isAdypu = email.endsWith('@adypu.edu.in') || email.includes('e26b') || email.includes('e25b');

  if (isAdypu && !studentEmails.has(email) && !studentNames.has(nameNorm)) {
    extraNstFromGateway.push({
      name,
      email,
      urn: email.split('@')[0].toUpperCase(),
      phone: gw['Contact No'],
      gender: 'Male',
      t_shirt_size: 'M',
      weight: '—',
      height: '—',
      study_year: email.includes('e25') ? '2nd' : '1st',
      proof: 'Direct Gateway Payment',
      amount: parseFloat(gw['Total Amount Transferred']) || 0,
      custId: gw['Customer ID'],
      txnId: gw['Transaction ID'],
      category: gw['Category']
    });
  }
}

console.log(`Unique NST Students from Form: ${uniqueStudents.length}`);
console.log(`Extra NST Students in Gateway (Direct): ${extraNstFromGateway.length}`);
extraNstFromGateway.forEach(e => console.log(`- ${e.name} (${e.email})`));

