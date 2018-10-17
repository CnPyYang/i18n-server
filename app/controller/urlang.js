'use strict';

const Controller = require('egg').Controller;

class UrLangController extends Controller {
  async add() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      data: {
        type: 'array',
        itemType: 'object',
        required: true,
        rule: {
          hostname: { type: 'string', required: true },
          lang_id: { type: 'number', required: true },
        },
      },
    });

    await service.urlang.addLangByUrl(params);

    ctx.body = { data: true };
  }

  async del() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      data: {
        type: 'array',
        itemType: 'number',
        required: true,
      },
    });

    await service.urlang.delLangByUrl(params);

    ctx.body = { data: true };
  }

  async list() {
    const { ctx, service } = this;

    ctx.validate({
      hostname: { type: 'string', required: true },
    }, ctx.request.query);

    const list = await service.urlang.getList(ctx.request.query);

    ctx.body = { data: list };
  }
}

module.exports = UrLangController;
