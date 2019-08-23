/*
 * @description: nodejs 入口，需要引入 module-alias 模块，支持node里面别名引入，参考：
 *   https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-23 15:53:13
 */
import 'module-alias/register';
import * as Koa from 'koa';
import * as path from 'path';
import * as config from 'config';
import * as koaBody from 'koa-body';
import * as Router from 'koa-router';
import middlewares from './middlewares';
import apiRouter from './routes';

// koa-static 不支持ts，直接用 require 引入
const koaStatic = require('koa-static');

const isDev = process.env.NODE_ENV === 'development';
const app = new Koa();
const router = new Router();

app.use(koaBody());

// 本地开发环境，前端资源直接代理到 webpack 服务上
if (isDev) {
  const httpProxy = require('http-proxy').createProxyServer();
  app.use((ctx: Koa.BaseContext, next: Function) => {
    const shouldIgnore = config
      .get<[string]>('webpackDevServerProxyIgnore')
      .find((em: string) => ctx.path.startsWith(em));

    if (shouldIgnore) {
      return next();
    } else {
      ctx.respond = false;
      return httpProxy.web(ctx.req, ctx.res, {
        target: `http://127.0.0.1:8888`,
      });
    }
  });
} else {
  // 线上环境暴露 static 目录
  const p = path.resolve(__dirname, '../../static');
  app.use(koaStatic(p));

  // 非线上环境暴露 sourcemap 目录
  if (process.env.NODE_ENV !== 'production') {
    const sourcemap = path.resolve(__dirname, '../../sourcemap');
    app.use(koaStatic(sourcemap));
  }
}

// 挂载自定义中间件
middlewares.loadMiddlewares(app);

// 心跳检查，用于运维监控服务异常
router.get('/health', async (ctx: Koa.BaseContext, next: Function) => {
  ctx.body = {
    status: {
      code: 'UP',
      description: 'yes',
    },
  };
});

// 挂载api路由
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
app.use(router.routes());

const port = process.env.port || config.get<number>('port') || 3000;
app.listen(port, () => {
  console.log(`listening on ${port} successfully!!!!`);
});

app.on('error', (err: Error, ctx: Koa.BaseContext) => {
  ctx.logger.error(err);
});
