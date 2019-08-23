/**
 * @description 开发环境配置，会合并 default.js 里面的配置
 * @author tracyqiu
 * @date 2019-8-9
 */

module.exports = {
  isDev: true,
  apiHost: {
    domain: 'http://127.0.0.1',
  },
  // 以下列表不走 webpackDevServer 代理
  webpackDevServerProxyIgnore: ['/api', '/bssologin', '/pageentry'],
};
