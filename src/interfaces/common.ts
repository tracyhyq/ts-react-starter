/*
 * @description: 前端和服务器端都需要使用的一些公用的接口描述
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-22 13:54:30
 */

export interface IServerResponse {
  /**
   * 返回错误码
   */
  code?: number;
  /**
   * 错误信息
   */
  msg?: string;
  /**
   * 返回的数据
   */
  // tslint:disable-next-line:no-any
  data?: any;
}
