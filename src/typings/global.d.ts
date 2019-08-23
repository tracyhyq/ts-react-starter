/*
 * @description: 全局的属性声明
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:24:17
 */

import * as Koa from 'koa';
import { AppLogger } from './server/middlewares/logger';

/**
 * @name: 重新定义koa，将logger加入到Context里面
 * @param {type}
 * @return:
 */
declare module 'koa' {
  interface Context extends Koa.BaseContext {
    logger: AppLogger;
  }
}
