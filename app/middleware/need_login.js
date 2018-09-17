'use strict';

const { AUTH_TOKEN_VERIFY_FAIL } = require('../../constants/error_codes');

module.exports = () => {
  return async function needLogin(ctx, next) {
    const access_token = ctx.request.headers['x-access-token'] || ctx.cookies.get('x-access-token');
    const errLogin = ctx => ctx.throw(AUTH_TOKEN_VERIFY_FAIL.msg, { errCode: AUTH_TOKEN_VERIFY_FAIL.code });

    if (!access_token) {
      return errLogin(ctx);
    }

    try {
      const verify_result = await ctx.service.auth.verifyToken(access_token);

      if (verify_result.result) {
        const { info } = verify_result;
        ctx.request.user = { id: info.id, username: info.username };
        return next();
      }
      errLogin(ctx);
    } catch (err) {
      errLogin(ctx);
    }
  };
};
