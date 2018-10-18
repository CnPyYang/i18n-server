'use strict';

const _ = require('lodash');
const Controller = require('egg').Controller;
const { hasRepeatKey } = require('../commons/utils');
const { I18N_REPEAT_KEY, I18N_EXIST_KEY } = require('../../constants/error_codes');

class KvController extends Controller {
  async save() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      pathname: { type: 'string', required: true },
      data: {
        type: 'array',
        itemType: 'object',
        required: true,
        rule: {
          url_lang_id: { type: 'number', required: true },
          key: { type: 'string', required: true },
          value: { type: 'string', allowEmpty: true },
        },
      },
    });

    const keys = _.keys(_.keyBy(params.data, 'key'));

    // 检查自己是否存在重复 key
    if (hasRepeatKey(keys)) {
      ctx.throw(I18N_REPEAT_KEY.msg, { errCode: I18N_REPEAT_KEY.code });
    }

    const url_lang_info = {};

    params.data.forEach(item => {
      if (!url_lang_info[item.url_lang_id]) {
        url_lang_info[item.url_lang_id] = [];
      }
      url_lang_info[item.url_lang_id].push(item.key);
      item.pathname = params.pathname;
    });

    // 检查数据库是否存在重复 key
    const url_lang_ids = Object.keys(url_lang_info);

    for (let i = 0, len = url_lang_ids.length; i < len; i++) {
      const url_lang_id = url_lang_ids[i];
      const keys = url_lang_info[url_lang_id];
      const exist_items = await service.kv.findByKeys(url_lang_id, keys);

      if (exist_items && exist_items.length) {
        ctx.throw(I18N_EXIST_KEY.msg, { errCode: I18N_EXIST_KEY.code, data: exist_items });
      }
    }

    await service.kv.save(params);

    ctx.body = { data: true };
  }

  async update() {
    const { ctx, service } = this;
    const params = ctx.request.body;

    ctx.validate({
      pathname: { type: 'string', required: true },
      data: {
        type: 'array',
        itemType: 'object',
        required: true,
        rule: {
          id: { type: 'number', required: true },
          key: { type: 'string', required: true },
          value: { type: 'string', allowEmpty: true },
        },
      },
    });

    const keys = _.keys(_.keyBy(params.data, 'key'));

    // 检查自己是否存在重复 key
    if (hasRepeatKey(keys)) {
      ctx.throw(I18N_REPEAT_KEY.msg, { errCode: I18N_REPEAT_KEY.code });
    }

    await service.kv.update(params);

    ctx.body = { data: true };
  }

  async getItem() {
    const { ctx, service } = this;

    ctx.validate({
      key: { type: 'string', required: true },
      hostname: { type: 'string', required: true },
      pathname: { type: 'string', required: true },
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

module.exports = KvController;
