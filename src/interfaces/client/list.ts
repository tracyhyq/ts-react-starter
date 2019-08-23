/*
 * @description: List 模块前端需要的类型声明
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-22 15:04:58
 */

import { IServerResponse } from '../common';
import { IListItem } from '../server/list';

export interface IListRes extends IServerResponse {
  data?: IListItem[];
}
