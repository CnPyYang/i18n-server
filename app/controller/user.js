'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getProfile() {
    const { ctx, service } = this;

    ctx.body = 'hi';
  }
}

module.exports = UserController;
