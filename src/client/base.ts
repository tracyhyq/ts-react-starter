/*
 * @description: polyfill
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-23 15:56:39
 */

import 'tslib';

/**
 * 兼容平板以及其他呀客户端上的事件
 */
// tslint:disable:no-var-requires
const attachFastClick = require('./lib/fastclick.js');
if (document && attachFastClick && attachFastClick.attach) {
  attachFastClick.attach(document.body);
}
// 基础库
import 'react';
import 'react-dom';
import 'mobx';
import 'mobx-react';

console.log(`当前环境：${process.env.NODE_ENV}`);
