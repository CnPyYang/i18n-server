'use strict';

const fs = require('fs');
const path = require('path');

exports.auth = {
  TOKEN_EXPIRE: 7 * 24 * 60 * 60, // s
  JWT_SECRET: 'jmXUG44jMrM1tfBlWmmtDZvjyHodOib',
};

exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'candy-tst.mysql.master.candy.one',
    // 端口号
    port: '3306',
    // 用户名
    user: 'telegram_bot',
    // 密码
    password: '355xzyNEDN3P3Wmq',
    // 数据库名
    database: 'telegram_bot',
    // 证书
    ssl: {
      key: fs.readFileSync(path.join(__dirname, './ssl/test/client-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, './ssl/test/client-cert.pem')),
      ca: fs.readFileSync(path.join(__dirname, './ssl/test/server-ca.pem')),
    },
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};

exports.qiniu = {
  bucket: 'static',
  accessKey: 'Dp8kASWpn7U3ZZnJj_imYlDYwInr4FB-ELlZmG_q',
  secretKey: 'oeuSU99ZIS15fy8AI6tZzKKdBIOxiF6QhywhKHO5',
  uploadUrl: 'https://o3pvuu23u.qnssl.com',
};
