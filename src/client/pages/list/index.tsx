/*
 * @description: list模块，模块内页面路由入口
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-28 16:11:28
 */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import Main from './main';
import Detail from './detail';

interface IProps extends RouteComponentProps<{}> {}

export default class List extends React.Component<IProps, {}> {
  render() {
    return (
      <Switch>
        <Route path="/list/detail/:detailId" component={Detail} />
        <Route path="/list" component={Main} />
      </Switch>
    );
  }
}
