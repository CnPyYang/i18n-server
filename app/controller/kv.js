'use strict';

const _ = require('lodash');
const Controller = require('egg').Controller;
const { hasRepeatKey } = require('../commons/utils');
const { I18N_REPEAT_KEY, I18N_EXIST_KEY } = require('../../constants/error_codes');

class KvController extends Controller {
  async save() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    await checkSaveOrUpdateI18n('save', ctx, params, service);
    await service.kv.save(params);

    ctx.body = { data: true };
  }

  async update() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    await checkSaveOrUpdateI18n('update', ctx, params, service);
    await service.kv.update(params);

    ctx.body = { data: true };
  }

  async getItem() {
    const { ctx, service } = this;

    ctx.validate({
      id: { type: 'string', required: true },
    }, ctx.request.query);

    ctx.body = { data: await service.kv.findItem(ctx.request.query) };
  }

  async getList() {
    const { ctx, service } = this;

    ctx.validate({
      hostname: { type: 'string', required: true },
      pathname: { type: 'string', required: true },
    }, ctx.request.query);

    ctx.body = { data: await service.kv.findList(ctx.request.query) };
  }
}

async function checkSaveOrUpdateI18n(type, ctx, params, service) {
  const rules = {
    url_lang_id: { type: 'number', required: true },
    data: {
      type: 'array',
      itemType: 'object',
      required: true,
      rule: {
        key: { type: 'string', required: true },
        value: { type: 'string', allowEmpty: true },
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
    const exist_items = await service.i18n.findByKeys(params.url_lang_id, keys);

    if (exist_items && exist_items.length) {
      ctx.throw(I18N_EXIST_KEY.msg, { errCode: I18N_EXIST_KEY.code, data: exist_items });
    }

    params.data.forEach(item => {
      item.url_lang_id = params.url_lang_id;
    });
  }
}

module.exports = KvController;
