/*
 * @description: 中间件挂载首页
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-15 11:34:15
 */

import * as Koa from 'koa';
import logger from './logger';
import resFormatter from './response-formatter';

const packageJson = require('../../../package.json');

export default {
  loadMiddlewares: (app: Koa) => {
    app.use(logger(packageJson.name));
    app.use(resFormatter('^/api')); // 仅针对api开头的url进行格式化处理
  },
};
