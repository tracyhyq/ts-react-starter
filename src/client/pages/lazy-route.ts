/*
 * @description: 采用react16新特性，lazy 来做模块懒加载
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-29 15:02:29
 */

import { lazy } from 'react';

const List = lazy(() => import(/* webpackChunkName: "List" */ './list'));

export { List };
