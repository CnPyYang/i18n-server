'use strict';

module.exports = {
  // 用户相关 1xxx
  USER_NO_EXIST: { code: 1000, msg: '用户不存在' },

  // Auth 相关 2xxx
  AUTH_PASSWORD_WRONG: { code: 2000, msg: '密码错误' },
  AUTH_TOKEN_VERIFY_FAIL: { code: 2001, msg: 'TOKEN 验证失败，请重新登录' },

  // i18n 相关 3xxx
  I18N_REPEAT_KEY: { code: 3000, msg: '有重复的 key' },
  I18N_EXIST_KEY: { code: 3001, msg: '有已存在的 key' },
  I18N_URL_LANG_EXIST: { code: 30002, msg: '重复配置 URL_LANGUAGE' },
};
