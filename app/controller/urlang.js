'use strict';

const Controller = require('egg').Controller;

class UrLangController extends Controller {
  async add() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      hostname: { type: 'string', required: true },
      lang_id: { type: 'number', required: true },
    });

    await service.urlang.addLangByUrl(params);

    ctx.body = { data: true };
  }

  async update() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      id: { type: 'number', required: true },
      lang_id: { type: 'number', required: true },
    });

    await service.urlang.updateLangByUrl(params);

    ctx.body = { data: true };
  }

  async del() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      id: { type: 'number', required: true },
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
