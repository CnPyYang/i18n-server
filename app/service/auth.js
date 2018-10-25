'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Service = require('egg').Service;
const { USER_NO_EXIST, AUTH_PASSWORD_WRONG, AUTH_TOKEN_VERIFY_FAIL } = require('../../constants/error_codes');

class AuthService extends Service {
  async login({ username, password }) {
    const { ctx, service } = this;
    const user = await service.user.findByName(username);

    if (!user) {
      ctx.throw(USER_NO_EXIST.msg, { errCode: USER_NO_EXIST.code });
    }

    const check = bcrypt.compareSync(password, user.password);

    if (!check) {
      ctx.throw(AUTH_PASSWORD_WRONG.msg, { errCode: AUTH_PASSWORD_WRONG.code });
    }

    // invalid other tokens
    await this.invalidAccessToken(user.id);

    return await this.addLoginToken(user);
  }

  genUserAccessToken({ id, username }, extra = {}) {
    return jwt.sign(Object.assign({
      id,
      username,
    }, extra), this.config.auth.JWT_SECRET, { expiresIn: this.config.auth.TOKEN_EXPIRE });
  }

  async verifyToken(access_token) {
    try {
      const info = jwt.verify(access_token, this.config.auth.JWT_SECRET);

      const { id } = info;
      const utoken = await this.getAccessTokenByUserId(id);

      if (utoken && utoken === access_token) {
        return { result: true, info };
      }

      return { result: false, info };
    } catch (err) {
      this.ctx.throw(AUTH_TOKEN_VERIFY_FAIL.msg, { errCode: AUTH_TOKEN_VERIFY_FAIL.code });
    }
  }

  async addLoginToken(user) {
    const access_token = this.genUserAccessToken(user);

    await this.app.mysql.insert('i_passport', {
      user_id: user.id,
      access_token,
      expire_at: new Date(Date.now() + (this.config.auth.TOKEN_EXPIRE * 1000)),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      access_token,
      user: {
        id: user.id,
      },
    };
  }

  async invalidAccessToken(user_id) {
    await this.app.mysql.query('update i_passport set status = 0 where user_id = ? and status = 1', user_id);
  }

  async getAccessTokenByUserId(user_id) {
    const result = await this.app.mysql.query('select * from i_passport where user_id = ? and status = 1 order by id desc limit 0, 1', user_id);
    const data = result[0];

    if (!data) {
      return null;
    }

    return data.access_token;
  }
}

module.exports = AuthService;
