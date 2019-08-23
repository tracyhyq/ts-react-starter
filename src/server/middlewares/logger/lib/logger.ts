/*
 * @description:
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:14:44
 */
import * as Koa from 'koa';
import * as util from 'util';
import logUtil from './util';
import { IOption, LoggerContext } from './types';
import baseLogger from './baseLogger';

// 日志信息类型
export type IMsg = number | string | Object;

// tslint:disable:no-any
export class AppLogger {
  ctx: LoggerContext;
  // winston@next 现在还有 types
  private logger: any;
  private errorLogger: any;

  constructor(option?: IOption) {
    this.logger = baseLogger(option).info;
    this.errorLogger = baseLogger(option).error;
  }

  /**
   * 初始化请求上下文，以及 startTime
   *
   * @param {any} ctx
   * @memberof AppLogger
   */
  init(ctx: Koa.BaseContext) {
    this.ctx = ctx;
    // 记录开始时间
    this.ctx.startTime = Date.now();
  }

  /**
   * 生成业务 message
   *
   * @private
   * @param {string} msg 自定义 message
   * @returns {string} 生成后的业务 message
   * @memberof AppLogger
   */
  private getMessage(msg: IMsg, ...args: any[]): string {
    if (!this.ctx.traceId) {
      this.ctx.traceId = logUtil.getTraceId();
    }

    if (
      (typeof msg === 'number' || typeof msg === 'string') &&
      args.length > 0
    ) {
      msg = util.format(String(msg), ...args);
    }

    if (typeof msg === 'object') {
      msg = util.inspect(msg);
    }

    const userId = this.ctx.userId || '-';
    const spendTime = this.ctx.startTime ? Date.now() - this.ctx.startTime : 0;
    return (
      '[' +
      userId +
      '/' +
      this.ctx.ip +
      '/' +
      this.ctx.traceId +
      '/' +
      spendTime +
      'ms ' +
      this.ctx.method +
      ' ' +
      this.ctx.url +
      ' ' +
      this.ctx.status +
      '] ' +
      msg
    );
  }

  /**
   * info 日志
   * 记录业务数据等
   *
   * @param {IMsg} msg
   * @param {any} args
   * @memberof Logger
   */
  info(msg: IMsg, ...args: any[]): void {
    const bizMsg = this.getMessage(msg, ...args);
    this.logger.info(bizMsg);
  }

  /**
   * warn 日志
   * 记录业务已知异常，比如某个 Thrift 异常，try catch 中异常
   *
   * @param {IMsg} msg
   * @param {any} args
   * @memberof Logger
   */
  warn(msg: IMsg, ...args: any[]): void {
    const bizMsg = this.getMessage(msg, ...args);
    this.logger.warn(bizMsg);
  }

  /**
   * 对外暴露 error format 方法，供其他地方调用
   *
   * @param {(string | Error)} msg 错误 message
   * @param {any} args
   * @returns
   * @memberof AppLogger
   */
  errorFormat(msg: string | Error, ...args: any[]) {
    if (msg instanceof Error) {
      msg = logUtil.errorFormat(msg);
    } else {
      const message = util.format(msg, ...args);
      msg = logUtil.errorFormat(new Error(message));
    }
    return this.getMessage(msg);
  }
  /**
   * error 日志
   * 记录需要上报
   *
   * @param {string | Error} msg
   * @param {any} args
   * @memberof Logger
   */
  error(msg: string | Error, ...args: any[]): void {
    const bizMsg = this.errorFormat(msg, ...args);
    this.errorLogger.error(bizMsg);
  }
}
