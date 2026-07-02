const https = require('https');
const fs = require('fs');

const cookies = JSON.parse(fs.readFileSync('C:/project/.cache/cookies.json', 'utf8'));
const cookieStr = cookies.cookies.map(c => `${c.name}=${c.value}`).join('; ');
const baseUrl = 'weztkk.aliwork.com';

const request = (path, method, data) => {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : '';
    const options = {
      hostname: baseUrl,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieStr,
        'Content-Length': body.length
      }
    };
    const req = https.request(options, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(result);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

const wldwData = [
  { textField_mnznbh90: "深圳市腾达电子有限公司", textField_mnznbh9a: "李先生", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "A", textField_mnznbh9f: "0755-12345678", textField_mnznbh9b: "litest@163.com", textareaField_mnznbh99: "深圳市南山区科技园", textField_mnznbh9d: "采购经理", textareaField_mnznbh9h: "长期合作供应商" },
  { textField_mnznbh90: "广州星河建材商行", textField_mnznbh9a: "王老板", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "B", textField_mnznbh9f: "020-88888888", textField_mnznbh9b: "xinghe@163.com", textareaField_mnznbh99: "广州市天河区珠江新城", textField_mnznbh9d: "总经理", textareaField_mnznbh9h: "建材批发" },
  { textField_mnznbh90: "东莞市金鸿五金制品厂", textField_mnznbh9a: "张厂", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "A", textField_mnznbh9f: "0769-88886666", textField_mnznbh9b: "jhmetal@163.com", textareaField_mnznbh99: "东莞市长安镇乌沙工业区", textField_mnznbh9d: "厂长", textareaField_mnznbh9h: "专业五金加工" },
  { textField_mnznbh90: "佛山市顺德家具城", textField_mnznbh9a: "陈总", selectField_mnznbh97_value: "客户", selectField_mnznbh98_value: "A", textField_mnznbh9f: "0757-22334455", textField_mnznbh9b: "furniture@163.com", textareaField_mnznbh99: "佛山市顺德区乐从镇", textField_mnznbh9d: "董事长", textareaField_mnznbh9h: "家具批发商" },
  { textField_mnznbh90: "惠州市华祥物流公司", textField_mnznbh9a: "刘司机", selectField_mnznbh97_value: "服务商", selectField_mnznbh98_value: "B", textField_mnznbh9f: "0752-8822666", textField_mnznbh9b: "huaxiang@163.com", textareaField_mnznbh99: "惠州市惠城区小金口", textField_mnznbh9d: "经理", textareaField_mnznbh9h: "物流运输" },
  { textField_mnznbh90: "中山市创亿电子科技", textField_mnznbh9a: "赵工", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "A", textField_mnznbh9f: "0760-88776655", textField_mnznbh9b: "chuangyi@163.com", textareaField_mnznbh99: "中山市火炬开发区", textField_mnznbh9d: "技术主管", textareaField_mnznbh9h: "电子产品" },
  { textField_mnznbh90: "珠海市金海装璜材料", textField_mnznbh9a: "周女士", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "B", textField_mnznbh9f: "0756-8123456", textField_mnznbh9b: "jinhai@163.com", textareaField_mnznbh99: "珠海市香洲区前山", textField_mnznbh9d: "财务", textareaField_mnznbh9h: "装璜材料" },
  { textField_mnznbh90: "江门市华阳不锈钢", textField_mnznbh9a: "吴先生", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "A", textField_mnznbh9f: "0750-3166888", textField_mnznbh9b: "huayang@163.com", textareaField_mnznbh99: "江门市蓬江区杜阮镇", textField_mnznbh9d: "销售", textareaField_mnznbh9h: "不锈钢板材" },
  { textField_mnznbh90: "肇庆市德庆县木材厂", textField_mnznbh9a: "郑木匠", selectField_mnznbh97_value: "供应商", selectField_mnznbh98_value: "C", textField_mnznbh9f: "0758-7788999", textField_mnznbh9b: "deqing@163.com", textareaField_mnznbh99: "肇庆市德庆县城", textField_mnznbh9d: "老板", textareaField_mnznbh9h: "木材加工" },
  { textField_mnznbh90: "梅州市客家装饰公司", textField_mnznbh9a: "赖总", selectField_mnznbh97_value: "客户", selectField_mnznbh98_value: "B", textField_mnznbh9f: "0753-2233666", textField_mnznbh9b: "kejia@163.com", textareaField_mnznbh99: "梅州市梅江区江南", textField_mnznbh9d: "总经理", textareaField_mnznbh9h: "装修工程" }
];

const formUuid = 'FORM-88CF02B2650045BA858F01F770DA0AD7H470';
const appType = 'APP_VC657HTLC1V2LC04NGHX';

(async () => {
  for (const data of wldwData) {
    try {
      const result = await request(`/v1/form/${appType}/${formUuid}/saveFormData`, 'POST', { formData: data });
      if (result.success) {
        console.log(`✓ ${data.textField_mnznbh90}`);
      } else {
        console.log(`✗ ${data.textField_mnznbh90}: ${result.errorMsg}`);
      }
    } catch (e) {
      console.log(`✗ ${data.textField_mnznbh90}: ${e.message || e}`);
    }
  }
  console.log('往来单位完成');
})();