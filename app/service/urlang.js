'use strict';

const Service = require('egg').Service;
const { I18N_URL_LANG_EXIST, I18N_URL_LANG_NOFOUND } = require('../../constants/error_codes');

class UrLangService extends Service {
  async findInfosByUrl(hostname) {
    const sql = 'select * from i_i18n_url_lang where hostname = ? and status = 1';
    return await this.app.mysql.query(sql, hostname);
  }

  async countByUrlLangId({ hostname, lang_id }) {
    const sql = 'select count(1) from i_i18n_url_lang where hostname = ? and lang_id = ? and status = 1';
    return await this.app.mysql.query(sql, [ hostname, lang_id ]);
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

  async delLangByUrl({ id }) {
    const res = await this.findByUrlLangId(id);

    if (res.length === 0) {
      this.ctx.throw(I18N_URL_LANG_NOFOUND.msg, { errCode: I18N_URL_LANG_NOFOUND.code });
    }

    const sql = 'update i_i18n_url_lang set status = 0 where id = ?';
    await this.app.mysql.query(sql, id);
  }

  async getList({ hostname }) {
    const sql = 'select * from i_i18n_url_lang where hostname = ? and status = 1';
    return await this.app.mysql.query(sql, hostname);
  }
}

module.exports = UrLangService;
