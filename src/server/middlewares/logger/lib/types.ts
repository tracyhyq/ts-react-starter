/*
 * @description: logger 公用 Interface 定义
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:19:15
 */

// tslint:disable:no-any
import * as Koa from 'koa';

/**
 * 日志分割配置
 *
 * @export
 * @interface IOption
 */
export interface IOption {
  // level info 日志配置
  info?: {
    filename?: string;
    datePattern?: string;
    zippedArchive?: boolean;
    maxSize?: string;
    maxFiles?: string;
  };
  // level error 日志配置
  error?: {
    filename?: string;
    datePattern?: string;
    zippedArchive?: boolean;
    maxSize?: string;
    maxFiles?: string;
  };
}

interface IObjIndex {
  [key: string]: any;
}

/**
 * 让 IErrorRes 支持索引
 */
export interface IErrorRes extends IObjIndex {
  name?: string;
  code?: string | number;
  host?: string;
  message?: string;
  stack?: any;
}

export interface LoggerContext extends Koa.BaseContext {
  traceId?: string;
}
