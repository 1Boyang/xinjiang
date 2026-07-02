const https = require('https');
const fs = require('fs');

const cookies = JSON.parse(fs.readFileSync('C:/project/.cache/cookies.json', 'utf8'));
const cookieStr = cookies.cookies.map(c => c.name + '=' + c.value).join('; ');
const appType = 'APP_VC657HTLC1V2LC04NGHX';
const formUuid = 'FORM-88CF02B2650045BA858F01F770DA0AD7H470';

const options = {
  hostname: 'weztkk.aliwork.com',
  path: `/v1/form/${appType}/${formUuid}/searchFormData?pageSize=1`,
  method: 'GET',
  headers: {
    'Cookie': cookieStr
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.on('error', e => console.log(e));
req.end();