'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app;
  const needLogin = app.middleware.needLogin();

  // auth
  router.post('/api/auth/login', 'auth.login');

  // user
  router.get('/api/user/profile', needLogin, 'user.getProfile');

  // languages
  router.get('/api/languages', needLogin, 'languages.getLanguages');

  // i18n
  router.post('/api/urlang/add', needLogin, 'urlang.add');
  router.post('/api/urlang/del', needLogin, 'urlang.del');
  router.get('/api/urlang/list', needLogin, 'urlang.list');

  // kv
  router.post('/api/kv/save', needLogin, 'kv.save');
  router.post('/api/kv/update', needLogin, 'kv.update');
  router.get('/api/kv/item', needLogin, 'kv.getItem');
  router.get('/api/kv/list', needLogin, 'kv.getList');

  // download

  // project
};
