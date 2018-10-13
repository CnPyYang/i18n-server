'use strict';

exports.isArray = arr => Object.prototype.toString.call(arr) === '[object Array]';

exports.isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

exports.hasRepeatKey = keys => {
  const temp = {};
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    if (temp[key]) {
      return true;
    }
    temp[key] = true;
  }
  return false;
};
