'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class CdnService extends Service {
  _genI18n(urlang_infos, kvs) {
    const i18n = {};

    urlang_infos.forEach(({ lang_key }) => {
      if (!i18n[lang_key]) {
        i18n[lang_key] = {};
      }
    });

    const map_urlang_infos = _.keyBy(urlang_infos, 'id');

    kvs.forEach(kv => {
      const { key, value, url_lang_id } = kv;
      const lang_key = map_urlang_infos[url_lang_id.toString()].lang_key;
      i18n[lang_key][key] = value;
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
    const mapLangsById = _.keyBy(langs, 'id');

    urlang_infos.forEach(info => {
      info.lang_key = mapLangsById[info.lang_id.toString()].key;
    });

    const kvs = await service.kv.findByUrlangIds(urlang_ids);
    const site_i18n = this._genI18n(urlang_infos, kvs);


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
      pages_i18n[pathname] = this._genI18n(urlang_infos, _pages_i18n[pathname]);
    });

    return {
      site_i18n,
      pages_i18n,
    };
  }
}

module.exports = CdnService;
