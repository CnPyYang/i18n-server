'use strict';

const _ = require('lodash');
const Service = require('egg').Service;

class KvService extends Service {
  async save(params) {
    return await this.app.mysql.insert('i_i18n_key_value', params.data);
  }

  async update(params) {
    const items = params.data;

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      const sql = 'update i_i18n_key_value set `key` = ?, value = ? where id = ? and status = 1';
      await this.app.mysql.query(sql, [ item.key, item.value, item.id ]);
    }
  }

  async findByKeys(url_lang_id, keys) {
    const sql = `select * from i_i18n_key_value where url_lang_id = ? and \`key\` in (${Array.from({ length: keys.length }, () => '?').join(',')})`;
    return await this.app.mysql.query(sql, [ url_lang_id, ...keys ]);
  }

  async findList({ hostname, pathname }) {
    const url_lang_infos = await this.service.UrLang.findInfosByUrl(hostname);
    const url_lang_infos_by_id = _.keyBy(url_lang_infos, 'id');
    const url_lang_ids = _.keys(url_lang_infos_by_id);

    if (url_lang_ids.length === 0) {
      return [];
    }

    const sql = `select * from i_i18n_key_value where url_lang_id in (${Array.from({ length: url_lang_ids.length }, () => '?').join(',')}) and pathname = '${pathname}' `;
    return await this.app.mysql.query(sql, url_lang_ids);
  }

  async findItem({ id }) {
    return await this.app.mysql.query('select * from i_i18n_key_value where id = ?', id);
  }
}

module.exports = KvService;
