'use strict';

const Service = require('egg').Service;

class CdnService extends Service {
  _genI18n(langs, kvs) {
    const i18n = {};
    langs.forEach(lang => {
      const lang_key = lang.key;
      i18n[lang_key] = {};

      kvs.forEach(kv => {
        const { key, value } = kv;
        i18n[lang_key][key] = value;
      });
    });
    return i18n;
  }

  async genI18n(hostname) {
    const { service } = this;

    const urlang_infos = await service.urlang.findByHostname(hostname);

    const urlang_ids = [];
    const lang_ids = [];

    urlang_infos.forEach(({ id, lang_id }) => {
      urlang_ids.push(id);
      lang_ids.push(lang_id);
    });

    const langs = await service.languages.findByIds(lang_ids);
    const kvs = await service.kv.findByUrlangIds(urlang_ids);

    const site_i18n = this._genI18n(langs, kvs);

    const _pages_i18n = {};
    const pages_i18n = {};

    kvs.forEach(kv => {
      const { pathname } = kv;

      if (!_pages_i18n[pathname]) {
        _pages_i18n[pathname] = [];
      }

      _pages_i18n[pathname].push(kv);
    });

    Object.keys(_pages_i18n).forEach(pathname => {
      pages_i18n[pathname] = this._genI18n(langs, _pages_i18n[pathname]);
    });

    return {
      site_i18n,
      pages_i18n,
    };
  }
}

module.exports = CdnService;
