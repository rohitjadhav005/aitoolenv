const http = require('http');

const attacks = [
  { name: 'Classic OR 1=1', email: "' OR '1'='1", password: "password" },
  { name: 'Admin Drop Table', email: "admin@example.com'; DROP TABLE users; --", password: "password" },
  { name: 'Union Select', email: "' UNION SELECT * FROM users --", password: "password" },
  { name: 'Tautology', email: "' OR 1=1 --", password: "password" }
];

async function runTest(attack) {
  return new Promise((resolve) => {
    const data = JSON.stringify(attack);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody
        });
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('--- SQL Injection Security Test ---');
  
  for (const attack of attacks) {
    console.log(`\nTesting payload [${attack.name}]: ${attack.email}`);
    const result = await runTest({ email: attack.email, password: attack.password });
    
    if (result) {
      console.log(`HTTP Status: ${result.status}`);
      console.log(`Response: ${result.body}`);
      
      if (result.status === 400 || result.status === 401) {
        console.log('✅ SECURE: Injection attempt failed appropriately.');
      } else if (result.status === 200) {
        console.log('❌ VULNERABLE: Login bypassed successfully!');
      } else {
        console.log('⚠️ UNEXPECTED: Server returned an unexpected error.');
      }
    }
  }
}

main();
