'use strict';

const Service = require('egg').Service;

class LanguagesService extends Service {
  async findLanguages() {
    return await this.app.mysql.query('select * from i_languages');
  }

}

module.exports = LanguagesService;
