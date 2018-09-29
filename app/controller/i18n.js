'use strict';

const Controller = require('egg').Controller;

class I18nController extends Controller {
  async getLanguages() {
    const { ctx, service } = this;
    ctx.body = { languages: await service.i18n.findLanguages() };
  }

  async save() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      data: {
        type: 'array',
        itemType: 'object',
        required: true,
        rule: {
          url: { type: 'string', required: true },
          key: { type: 'string', required: true },
          lang_id: { type: 'number', required: true },
          value: { type: 'string' },
        },
      },
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
