'use strict';

const Controller = require('egg').Controller;

class LanguagesController extends Controller {
  async getLanguages() {
    const { ctx, service } = this;
    ctx.body = { languages: await service.languages.findLanguages() };
  }
}

module.exports = LanguagesController;
