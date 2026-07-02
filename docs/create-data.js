const { spawn } = require('child_process');

const dataList = [
  {
    name: "深圳市腾达电子有限公司",
    contact: "李先生",
    type: "供应商",
    level: "A",
    phone: "0755-12345678",
    email: "litest@163.com",
    address: "深圳市南山区科技园",
    position: "采购经理",
    remark: "长期合作供应商"
  },
  {
    name: "广州星河建材商行",
    contact: "王老板",
    type: "供应商",
    level: "B",
    phone: "020-88888888",
    email: "xinghe@163.com",
    address: "广州市天河区珠江新城",
    position: "总经理",
    remark: "建材批发"
  },
  {
    name: "东莞市金鸿五金制品厂",
    contact: "张厂",
    type: "供应商",
    level: "A",
    phone: "0769-88886666",
    email: "jhmetal@163.com",
    address: "东莞市长安镇乌沙工业区",
    position: "厂长",
    remark: "专业五金加工"
  },
  {
    name: "佛山市顺德家具城",
    contact: "陈总",
    type: "客户",
    level: "A",
    phone: "0757-22334455",
    email: "furniture@163.com",
    address: "佛山市顺德区乐从镇",
    position: "董事长",
    remark: "家具批发商"
  },
  {
    name: "惠州市华祥物流公司",
    contact: "刘司机",
    type: "服务商",
    level: "B",
    phone: "0752-8822666",
    email: "huaxiang@163.com",
    address: "惠州市惠城区小金口",
    position: "经理",
    remark: "物流运输"
  },
  {
    name: "中山市创亿电子科技",
    contact: "赵工",
    type: "供应商",
    level: "A",
    phone: "0760-88776655",
    email: "chuangyi@163.com",
    address: "中山市火炬开发区",
    position: "技术主管",
    remark: "电子产品"
  },
  {
    name: "珠海市金海装璜材料",
    contact: "周女士",
    type: "供应商",
    level: "B",
    phone: "0756-8123456",
    email: "jinhai@163.com",
    address: "珠海市香洲区前山",
    position: "财务",
    remark: "装璜材料"
  },
  {
    name: "江门市华阳不锈钢",
    contact: "吴先生",
    type: "供应商",
    level: "A",
    phone: "0750-3166888",
    email: "huayang@163.com",
    address: "江门市蓬江区杜阮镇",
    position: "销售",
    remark: "不锈钢板材"
  },
  {
    name: "肇庆市德庆县木材厂",
    contact: "郑木匠",
    type: "供应商",
    level: "C",
    phone: "0758-7788999",
    email: "deqing@163.com",
    address: "肇庆市德庆县城",
    position: "老板",
    remark: "木材加工"
  },
  {
    name: "梅州市客家装饰公司",
    contact: "赖总",
    type: "客户",
    level: "B",
    phone: "0753-2233666",
    email: "kejia@163.com",
    address: "梅州市梅江区江南",
    position: "总经理",
    remark: "装修工程"
  }
];

const formUuid = 'FORM-88CF02B2650045BA858F01F770DA0AD7H470';
const appType = 'APP_VC657HTLC1V2LC04NGHX';

const fieldMap = {
  name: 'textField_mnznbh90',
  contact: 'textField_mnznbh9a',
  type: 'selectField_mnznbh97_value',
  level: 'selectField_mnznbh98_value',
  phone: 'textField_mnznbh9f',
  email: 'textField_mnznbh9b',
  address: 'textareaField_mnznbh99',
  position: 'textField_mnznbh9d',
  remark: 'textareaField_mnznbh9h'
};

let index = 0;
const run = () => {
  if (index >= dataList.length) {
    console.log('往来单位完成');
    return;
  }
  const item = dataList[index];
  const formData = {};
  for (const key in fieldMap) {
    if (item[key]) formData[fieldMap[key]] = item[key];
  }
  const json = JSON.stringify(formData);
  const args = ['data', 'create', 'form', appType, formUuid, '--data-json', json];
  const child = spawn('openyida', args, { shell: true });
  let output = '';
  child.stdout.on('data', d => output += d);
  child.stderr.on('data', d => output += d);
  child.on('close', code => {
    if (code === 0 && output.includes('"success":true')) {
      console.log(`✓ ${item.name}`);
    } else {
      console.log(`✗ ${item.name}`);
    }
    index++;
    setTimeout(run, 500);
  });
};

run();