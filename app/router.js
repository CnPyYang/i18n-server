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

  //
};
