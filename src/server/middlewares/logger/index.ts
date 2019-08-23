/*
 * @description: 日志中心中间件
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:07:24
 */

import { AppLogger } from './lib/logger';
import * as Koa from 'koa';

/**
 * @name: 统一封装的接口请求，会把错误信息统一格式化传输过来，格式如下：
 *        Error: {"url": "http://xxxx", "status": 500, "message": "Server Error"}
 * @param {err}
 * @return: 返回一个错误 json 对象
 * {
 *   "url": "http://xxxx/path",
 *   "status": 500,
 *   "message": "Server Error"
 * }
 */
interface ErrorMessage {
  method?: string;
  status?: number;
  message?: string;
  url?: string;
}

const parseError = (err: string): ErrorMessage => {
  if (!err) {
    return {};
  }
  const errString = err.substring(6).trim();
  return JSON.parse(errString);
};

/**
 * @name: 生成日志
 * @param {projectName}
 * @return: Function
 */
export default (projectName: string): Koa.Middleware => {
  // 默认日志放到项目里面log目录下
  const defaultOptions = {
    info: {
      filename: `${process.cwd()}/logs/${projectName}-info-%DATE%.log`,
    },
    error: {
      filename: `${process.cwd()}/logs/${projectName}-error-%DATE%.log`,
    },
  };
  const logger = new AppLogger(defaultOptions);

  return async (ctx: Koa.BaseContext, next: Function) => {
    logger.init(ctx);
    // 将 logger 挂载到 ctx 上，后面的中间件可以用 ctx.logger 调用
    ctx.logger = logger;

    try {
      await next();
      // 正常执行添加 info 日志
      const method = ctx.method.toUpperCase();
      const params =
        method === 'GET' || method === 'PUT'
          ? ctx.request.query
          : ctx.request.body;
      ctx.logger.info(params);
    } catch (e) {
      // 从e.message 中获取错误信息
      const errJson = parseError(e.message);
      const err = `method:[${errJson.method}] 
                    - url:[${errJson.url}] 
                    - status:[${errJson.status}] 
                    - message:[${errJson.message}]`;
      ctx.status = errJson.status || 500;
      ctx.body = {
        code: errJson.status || 500,
        message: errJson.message || e.message,
      };
      // 错误日志记录
      ctx.logger.error(err);
    }
  };
};
