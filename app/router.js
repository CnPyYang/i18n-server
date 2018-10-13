'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const needLogin = app.middleware.needLogin();

  // auth
  router.post('/api/auth/login', controller.auth.login);

  // user
  router.get('/api/user/profile', needLogin, controller.user.getProfile);

  // i18n
  router.get('/api/i18n/languages', needLogin, controller.i18n.getLanguages);
  router.post('/api/i18n/save', needLogin, controller.i18n.save);
  router.post('/api/i18n/update', needLogin, controller.i18n.update);
  router.get('/api/i18n/item', needLogin, controller.i18n.getItem);
  router.get('/api/i18n/list', needLogin, controller.i18n.getList);
};
