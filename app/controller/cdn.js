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

    const site_i18n_json = JSON.stringify(site_i18n);
    await uploadString(hostname, site_i18n_json);

    const pages_paths = Object.keys(pages_i18n);
    const pages_upload_urls = {};
    for (let i = 0, len = pages_paths.length; i < len; i++) {
      const page_path = pages_paths[i];
      const page_i18n_json = JSON.stringify(pages_i18n[page_path]);
      await uploadString(`${hostname}${page_path}`, page_i18n_json);
      pages_upload_urls[page_path] = `${config.qiniu.uploadUrl}/${hostname}${page_path}`;
    }

    ctx.body = {
      data: {
        site: `${config.qiniu.uploadUrl}/${hostname}`,
        pages: pages_upload_urls,
      },
    };
  }
}

module.exports = CdnController;
