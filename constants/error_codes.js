'use strict';

module.exports = {
  // 用户相关 1xxx
  USER_NO_EXIST: { code: 1000, msg: '用户不存在' },

  // Auth 相关 2xxx
  AUTH_PASSWORD_WRONG: { code: 2000, msg: '密码错误' },
  AUTH_TOKEN_VERIFY_FAIL: { code: 2001, msg: 'TOKEN 验证失败，请重新登录' },
};
