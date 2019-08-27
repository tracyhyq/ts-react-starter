/*
 * @description: list模块，页面路由入口
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-27 09:50:20
 */

import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Main from './main';
import Detail from './detail';

class List extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="list-wrap">
        <HashRouter>
          <Switch>
            <Route path="/detail/:detailId" component={Detail} />
            <Route path="/" component={Main} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

render(<List />, document.getElementById('app'));
