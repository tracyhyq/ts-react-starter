/*
 * @description: 对指定路径的接口返回统一的数据格式
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 15:08:14
 */

import * as Koa from 'koa';

/**
 * @name: 格式化返回 json
 * @param {ctx}
 * @return: void
 */
const format = (ctx: Koa.BaseContext) => {
  const data = ctx.body;
  if (data.hasOwnProperty('code') && data.hasOwnProperty('message')) {
    ctx.body = data;
  } else {
    ctx.body = {
      code: 0,
      message: 'success',
      data,
    };
  }
};

export default (pattern: string): Koa.Middleware => {
  return async (ctx: Koa.BaseContext, next: Function) => {
    const reg = new RegExp(pattern);
    try {
      await next();
    } catch (e) {
      if (e) {
        ctx.logger.error(e);

        ctx.status = 500;
        ctx.body = {
          code: e.code || -1,
          message: e.message || 'Server Error',
        };
      } else {
        ctx.logger.error('error object is null');
      }
    }

    if (reg.test(ctx.originalUrl)) {
      format(ctx);
    }
  };
};
