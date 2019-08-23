/*
 * @description: 详情页
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-22 15:02:04
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps<{}> {}
interface IState {}

@observer
export default class Detail extends React.Component<IProps, IState> {
  render() {
    return <div>Detail</div>;
  }
}
