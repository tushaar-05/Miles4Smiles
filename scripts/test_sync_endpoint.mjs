const res = await fetch('http://localhost:3000/api/sync/gateway', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    passcode: 'm4s@2026',
    rows: [
      {
        'Customer ID': 'TESTCUST1',
        'Transaction ID': 'TESTTXN1',
        'Buyer Name': 'Tanmay Jadhav',
        'Email ID': 'tanmayjadhav1018@gmail.com',
        'Contact No': '8451839557',
        'Category': 'Competitive 5K',
        'Total Amount Transferred': '249.00'
      }
    ]
  })
});

const data = await res.json();
console.log('API Response:', data);
