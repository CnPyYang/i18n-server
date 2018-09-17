'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const { ctx, service } = this;

    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });

    ctx.body = await service.auth.login(ctx.request.body);
  }
}

module.exports = AuthController;
