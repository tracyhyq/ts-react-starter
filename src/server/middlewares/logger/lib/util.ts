/*
 * @description: logger 工具转换
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:19:04
 */

// tslint:disable:no-any
import * as util from 'util';
import * as os from 'os';
import { IErrorRes } from './types';
const uuid = require('uuid/v4');
const convert = require('int64-convert');

const hostname = os.hostname();

/**
 * 对象一行字符串输出
 * @param key
 * @param value
 */
function inspect(key: string, value: any) {
  if (value && typeof value === 'object') {
    // force in one line
    value = util
      .inspect(value)
      .replace(/^\s+/gm, '')
      .replace(/\n/g, ' ');
  } else {
    value = util.inspect(value);
  }
  return key + ': ' + value;
}

export default {
  errorFormat(err: IErrorRes) {
    if (err.name === 'Error' && typeof err.code === 'string') {
      err.name = err.code + err.name;
    }

    if (err.host) {
      err.message += ` (${err.host})`;
    }

    err.stack = err.stack || 'no_stack';

    const errStack = err.stack;
    const errProperties = Object.keys(err)
      .map((key) => inspect(key, err[key]))
      .join('\n');
    return util.format(
      'nodejs.%s: %s\n%s\n%s\npid: %s\nhostname: %s\n',
      err.name,
      err.message,
      errStack.substring(errStack.indexOf('\n') + 1),
      errProperties,
      process.pid,
      hostname
    );
  },

  /**
   * 获取 traceId
   * @returns {string} tracdeId
   */
  getTraceId(): string {
    const uuidBuf = Buffer.alloc(16);
    uuid(null, uuidBuf);

    const traceBuf = Buffer.alloc(8);
    for (let l = 0, h = 8; l < 8; l++, h++) {
      traceBuf[l] = uuidBuf[l] ^ uuidBuf[h];
    }

    return convert.signedHexToDec(traceBuf.toString('hex')).replace('-', '');
  },
};
