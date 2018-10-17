'use strict';

const _ = require('lodash');
const Service = require('egg').Service;
const { I18N_URL_LANG_EXIST, I18N_URL_LANG_NOFOUND } = require('../../constants/error_codes');

class I18nService extends Service {
  async findLanguages() {
    return await this.app.mysql.query('select * from i_languages');
  }

  async findIdsUrlLangiDByUrl(hostname, pathname) {
    const sql = 'select * from i_i18n_url_lang where hostname = ? and pathname = ? and status = 1';
    return await this.app.mysql.query(sql, [ hostname, pathname ]);
  }

  async countByUrlLangId({ hostname, pathname, lang_id }) {
    const sql = 'select count(1) from i_i18n_url_lang where hostname = ? and pathname = ? and lang_id = ? and status = 1';
    return await this.app.mysql.query(sql, [ hostname, pathname, lang_id ]);
  }

  async findByUrlLangId(id) {
    const sql = 'select * from i_i18n_url_lang where id = ? and status = 1';
    return await this.app.mysql.query(sql, id);
  }

  async addLangByUrl(params) {
    const count = await this.countByUrlLangId(params);

    if (count === 0) {
      this.ctx.throw(I18N_URL_LANG_EXIST.msg, { errCode: I18N_URL_LANG_EXIST.code });
    }

    this.app.mysql.insert('i_i18n_url_lang', params);

    return true;
  }

  async updateLangByUrl(params) {
    const { id, lang_id } = params;
    const res = await this.findByUrlLangId(id);

    if (res.length === 0) {
      this.ctx.throw(I18N_URL_LANG_NOFOUND.msg, { errCode: I18N_URL_LANG_NOFOUND.code });
    }

    const sql = 'update i_i18n_url_lang set lang_id = ? where id = ? and status = 1';
    await this.app.mysql.query(sql, [ lang_id, id ]);
  }

  async delLangByUrl({ id }) {
    const res = await this.findByUrlLangId(id);

    if (res.length === 0) {
      this.ctx.throw(I18N_URL_LANG_NOFOUND.msg, { errCode: I18N_URL_LANG_NOFOUND.code });
    }

    const sql = 'update i_i18n_url_lang set status = 0 where id = ?';
    await this.app.mysql.query(sql, id);
  }

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
    const url_lang_infos = await this.findIdsUrlLangiDByUrl(hostname, pathname);
    const url_lang_infos_by_id = _.keyBy(url_lang_infos, 'id');
    const url_lang_ids = _.keys(url_lang_infos_by_id);

    if (url_lang_ids.length === 0) {
      return [];
    }

    const sql = `select * from i_i18n_key_value where url_lang_id in (${Array.from({ length: url_lang_ids.length }, () => '?').join(',')})`;
    return await this.app.mysql.query(sql, url_lang_ids);
  }

  async findItem({ id }) {
    return await this.app.mysql.query('select * from i_i18n_key_value where id = ?', id);
  }
}

module.exports = I18nService;
