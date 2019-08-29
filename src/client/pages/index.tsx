/*
 * @description: 入口文件，采用按模块路由打包进行chunk分割
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-29 15:39:46
 */

import * as React from 'react';
import { Suspense } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import { List } from './lazy-route';
import '../global.css';

const Loading = () => {
  return (
    <Spin
      size="large"
      spinning
      tip="loading..."
      wrapperClassName="page-loading"
    />
  );
};

class Entry extends React.PureComponent {
  render() {
    return (
      <div className="app-wrap">
        <Suspense fallback={Loading()}>
          <HashRouter>
            <Switch>
              <Route
                path="/list*"
                exact
                render={(props) => <List {...props} />}
              />
            </Switch>
          </HashRouter>
        </Suspense>
      </div>
    );
  }
}

render(<Entry />, document.getElementById('app'));
