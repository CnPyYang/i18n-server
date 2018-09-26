'use strict';

exports.isArray = arr => Object.prototype.toString.call(arr) === '[object Array]';
exports.isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';
