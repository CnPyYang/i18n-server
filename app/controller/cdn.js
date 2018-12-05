'use strict';

const Controller = require('egg').Controller;
const { uploadString } = require('../commons/qiniu');

class CdnController extends Controller {
  async genI18n() {
    const { ctx, service, config } = this;

    ctx.validate({
      hostname: { type: 'string', required: true },
    });

    const { hostname } = ctx.request.body;
    const { site_i18n, pages_i18n } = await service.cdn.genI18n(hostname);

    const script_wrap = json => `window.i18nData = ${json};`;
    const suffix_replace = (page_path, suffix) => {
      page_path = page_path.replace(/(\.html)$/, '');
      return page_path + suffix;
    };

    const site_i18n_json = JSON.stringify(site_i18n);
    await uploadString(`${hostname}.json`, site_i18n_json);

    const site_i18n_js = script_wrap(site_i18n_json);
    await uploadString(`${hostname}.js`, site_i18n_js);

    const pages_paths = Object.keys(pages_i18n);
    const pages_upload_js_urls = {};
    const pages_upload_json_urls = {};

    for (let i = 0, len = pages_paths.length; i < len; i++) {
      const page_path = pages_paths[i];
      const page_i18n_json = JSON.stringify(pages_i18n[page_path]);
      const page_i18n_js = script_wrap(page_i18n_json);

      await uploadString(`${hostname}${suffix_replace(page_path, '.js')}`, page_i18n_js);
      pages_upload_js_urls[page_path] = `${config.qiniu.uploadUrl}/${hostname}${suffix_replace(page_path, '.js')}`;

      await uploadString(`${hostname}${suffix_replace(page_path, '.json')}`, page_i18n_json);
      pages_upload_json_urls[page_path] = `${config.qiniu.uploadUrl}/${hostname}${suffix_replace(page_path, '.json')}`;
    }

    ctx.body = {
      data: {
        js: {
          site: `${config.qiniu.uploadUrl}/${hostname}.js`,
          pages: pages_upload_js_urls,
        },
        json: {
          site: `${config.qiniu.uploadUrl}/${hostname}.json`,
          pages: pages_upload_json_urls,
        },
      },
    };
  }
}

module.exports = CdnController;
