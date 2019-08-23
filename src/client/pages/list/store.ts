/*
 * @description: list store
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-22 15:04:38
 */

import { observable, action } from 'mobx';
import { IListItem } from '@I/server/list';
import { HttpUtil } from '@clientUtils/http-util';

class ListStore {
  /**
   * 列表数据
   */
  @observable
  listData: IListItem[] = [];

  @action
  fetchList = async () => {
    this.listData = await HttpUtil.get<IListItem[]>('/api/list/listData');
  };
}

export default new ListStore();
