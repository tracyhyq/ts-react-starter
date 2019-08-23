/*
 * @description: list模块，页面路由入口
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-20 16:08:18
 */

import * as React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router';
import Main from './main';
import Detail from './detail';

class List extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="list-wrap">
        <Switch>
          <Route path="/detail/:detailId" component={Detail} />
          <Route path="/" component={Main} />
        </Switch>
      </div>
    );
  }
}

render(<List />, document.getElementById('app'));
