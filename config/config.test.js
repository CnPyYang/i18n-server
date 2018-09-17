'use strict';

const fs = require('fs');
const path = require('path');

exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'candy-tst.mysql.master.candy.one',
    // 端口号
    port: '3306',
    // 用户名
    user: 'candy',
    // 密码
    password: 'K3eqOxSIz0mFUrAW',
    // 数据库名
    database: 'candy',
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
