/*
 * @description: 路由出口页
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-19 11:33:42
 */

import * as Router from 'koa-router';
import listRouter from './list';

const apiRouter = new Router();

apiRouter.use('/list', listRouter.routes(), listRouter.allowedMethods());

export default apiRouter;
