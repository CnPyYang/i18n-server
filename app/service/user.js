'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async findByName(username) {
    if (!username) {
      return null;
    }

    return await this.app.mysql.get('i_users', { username });
  }
}

module.exports = UserService;
