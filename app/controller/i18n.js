'use strict';

const Controller = require('egg').Controller;
const { isArray } = require('../commons/utils');

class I18nController extends Controller {
  async getLanguages() {
    const { ctx, service } = this;
    ctx.body = { languages: await service.i18n.findLanguages() };
  }

  async save() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    if (!isArray(params)) {
      this.throw(422, 'Validation Failed', {
        code: 'invalid_param',
        errors: 'param should be array',
      });
    }

    params.forEach(param => {
      ctx.validate({
        url: { type: 'string', required: true },
        key: { type: 'string', required: true },
        lang_id: { type: 'number', required: true },
        value: { type: 'string' },
      }, param);
    });
    await service.i18n.save(params);
    ctx.body = true;
  }

  async getItem() {
    const { ctx, service } = this;

    ctx.validate({
      url: { type: 'string', required: true },
      key: { type: 'string', required: true },
    }, ctx.request.query);

    ctx.body = await service.i18n.findItem(ctx.request.query);
  }

  async getList() {
    const { ctx, service } = this;

    ctx.validate({
      url: { type: 'string', required: true },
    }, ctx.request.query);

    ctx.body = await service.i18n.findList(ctx.request.query);
  }
}

module.exports = I18nController;
