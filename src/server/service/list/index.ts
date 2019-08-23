/*
 * @description: 列表页业务逻辑 service 层
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-23 15:39:27
 */

import { IListItem } from '@I/server/list';
import { HttpUtil } from '@serverUtils/axios';

class ListService {
  /**
   * @name: getList 获取列表数据
   * @param {type}
   * @return: IListRes
   */
  getList(): IListItem[] {
    const data = [];
    for (let i = 0; i < 10000; i++) {
      data.push({
        key: i,
        name: `tracy ${i}`,
        age: i + 1,
        address: `渝中区解放碑${i}号`,
      });
    }

    return data;
  }

  /**
   * @name: getDetailByKey 通过key 获取详情
   * @param {type}
   * @return: Promise<IListRes>
   */
  async getDetailByKey(key: string | number): Promise<IListItem> {
    const data = await HttpUtil.get<IListItem>('http://www.xxxx.com/detail', {
      params: {
        key,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  }
}

export default new ListService();
