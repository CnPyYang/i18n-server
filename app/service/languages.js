'use strict';

const Service = require('egg').Service;

class LanguagesService extends Service {
  async findLanguages() {
    return await this.app.mysql.query('select * from i_languages');
  }

  async findByIds(lang_ids) {
    if (lang_ids.length === 0) {
      return [];
    }

    const sql = `select * from i_languages where id in (${Array.from({ length: lang_ids.length }, () => '?').join(',')})`;

    return await this.app.mysql.query(sql, [ ...lang_ids ]);
  }

}

module.exports = LanguagesService;
