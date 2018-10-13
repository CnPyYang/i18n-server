'use strict';

const _ = require('lodash');
const Controller = require('egg').Controller;
const { hasRepeatKey } = require('../commons/utils');
const { I18N_REPEAT_KEY, I18N_EXIST_KEY } = require('../../constants/error_codes');


class I18nController extends Controller {
  async getLanguages() {
    const { ctx, service } = this;
    ctx.body = { languages: await service.i18n.findLanguages() };
  }

  async save() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    await checkSaveOrUpdateI18n('save', ctx, params, service);
    await service.i18n.save(params);
    ctx.body = true;
  }

  async update() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    await checkSaveOrUpdateI18n('update', ctx, params, service);
    await service.i18n.update(params);

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

async function checkSaveOrUpdateI18n(type, ctx, params, service) {
  const rules = {
    url: { type: 'string', required: true },
    data: {
      type: 'array',
      itemType: 'object',
      required: true,
      rule: {
        key: { type: 'string', required: true },
        lang_id: { type: 'number', required: true },
        value: { type: 'string' },
      },
    },
  };

  if (type === 'update') {
    rules.data.rule.id = { type: 'number', required: true };
  }

  ctx.validate(rules);

  const keys = _.keys(_.keyBy(params.data, 'key'));

  // 检查自己是否存在重复 key
  if (hasRepeatKey(keys)) {
    ctx.throw(I18N_REPEAT_KEY.msg, { errCode: I18N_REPEAT_KEY.code });
  }

  if (type === 'save') {
    // 检查数据库是否存在重复 key
    const exist_items = await service.i18n.findByKeys(params.url, keys);

    if (exist_items && exist_items.length) {
      ctx.throw(I18N_EXIST_KEY.msg, { errCode: I18N_EXIST_KEY.code, data: exist_items });
    }
  }

  params.data.forEach(item => {
    item.url = params.url;
  });
}

module.exports = I18nController;
