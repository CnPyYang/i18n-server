'use strict';

const qiniu = require('qiniu');
const conf = require('../../config/config.local').qiniu;

const mac = new qiniu.auth.digest.Mac(conf.accessKey, conf.secretKey);
const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const BUCKET = conf.bucket;

const DEFAULT_RETURN_BODY = '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","imageInfo":$(imageInfo),"mimeType":"$(mimeType)", "fname":"$(fname)"}';

const UPLOAD_TYPE_FILE = 'FILE';
const UPLOAD_TYPE_STRING = 'STRING';
const UPLOAD_TYPE_STREAM = 'STREAM';
const invoke = {
  [UPLOAD_TYPE_FILE]: 'putFile',
  [UPLOAD_TYPE_STRING]: 'put',
  [UPLOAD_TYPE_STREAM]: 'putStream',
};

function _getScope(bucket, key) {
  return `${bucket}:${key}`;
}

// 构建上传策略函数
function uptoken(bucket, key, options = {}) {
  if (key) bucket = _getScope(bucket, key);
  options.scope = bucket;
  if (options.returnBody === 'default') {
    options.returnBody = DEFAULT_RETURN_BODY;
  }
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}

// 上传文件
function uploadSource(bucket, key, source, type = UPLOAD_TYPE_FILE, options = {}) {
  // 生成上传 Token
  const token = uptoken(bucket, key, options);
  const putExtra = new qiniu.form_up.PutExtra();
  const method = invoke[type];
  // 文件上传
  return new Promise((resolve, reject) => {
    formUploader[method](token, key, source, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        return reject(respErr);
      }
      if (respInfo.statusCode !== 200) {
        return reject(new Error(respBody.error));
      }
      return resolve(respBody);
    });
  });
}

// 上传内存中的字符串
function uploadString(key, string, options = {}) {
  return uploadSource(BUCKET, key, string, UPLOAD_TYPE_STRING, options);
}

// 上传ReadableStream
function uploadStream(bucket, key, stream, options = {}) {
  return uploadSource(bucket, key, stream, UPLOAD_TYPE_STREAM, options);
}

function uploadRequestFile(key, reqFile) {
  return uploadStream(BUCKET, key, reqFile, { returnBody: 'default' });
}

module.exports.uploadRequestFile = uploadRequestFile;
module.exports.uploadString = uploadString;
