/*
 * @description: 用于处理 happypack 采用ts-import-plugin 处理antd 按需加载无效的问题
 *               https://github.com/Brooooooklyn/ts-import-plugin/issues/36
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-23 15:26:21
 */

const tsImportPluginFactory = require('ts-import-plugin');
module.exports = () => ({
  before: [
    tsImportPluginFactory({
      style: 'css',
    }),
  ],
});
