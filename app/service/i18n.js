'use strict';

const Service = require('egg').Service;

class I18nService extends Service {
  async findLanguages() {
    return await this.app.mysql.query('select * from i_languages');
  }

  async save(params) {
    return await this.app.mysql.insert('i_i18n', params.data);
  }

  async update(params) {
    const items = params.data;

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      await this.app.mysql.query('update i_i18n set value = ?, lang_id = ? where id = ? and `key` = ? and status = 1', [ item.value, item.lang_id, item.id, item.key ]);
    }
  }

  async findByKeys(url, keys) {
    return await this.app.mysql.query(`select * from i_i18n where url = ? and \`key\` in (${Array.from({ length: keys.length }, () => '?').join(',')})`, [ url, ...keys ]);
  }

  async findList({ url }) {
    return await this.app.mysql.query('select * from i_i18n where url = ?', url);
  }

  async findItem({ url, key }) {
    return await this.app.mysql.query('select * from i_i18n where url = ? and `key` = ?', [ url, key ]);
  }
}

module.exports = I18nService;
