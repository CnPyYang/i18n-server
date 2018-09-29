'use strict';

const Service = require('egg').Service;

class I18nService extends Service {
  async findLanguages() {
    return await this.app.mysql.query('select * from i_languages');
  }

  async save(params) {
    return await this.app.mysql.insert('i_i18n', params.data);
  }

  async findList({ url }) {
    return await this.app.mysql.query('select * from i_i18n where url = ?', url);
  }

  async findItem({ url, key }) {
    return await this.app.mysql.query('select * from i_i18n where url = ? and `key` = ?', [ url, key ]);
  }
}

module.exports = I18nService;
