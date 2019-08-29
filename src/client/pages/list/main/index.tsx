/*
 * @description: 列表主页面
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-28 16:12:45
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Table } from 'antd';
import { IListItem } from '@I/server/list';
import listStore from '../store';

interface IProps extends RouteComponentProps<{}> {}
interface IState {
  loaded: boolean;
}

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    render(text: string, record: IListItem) {
      return <Link to={`/list/detail/${record.key}`}>{text}</Link>;
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
  },
];

@observer
export default class MainList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    await listStore.fetchList();
    this.setState({
      loaded: true,
    });
  }

  createPagination = () => {
    const { listData } = listStore;

    return {
      total: listData.length,
      showSizeChanger: true,
      onShowSizeChange(current: number, pageSize: number) {
        console.log(`Current: ${current}; PageSize: ${pageSize}`);
      },
      onChange(current: number) {
        console.log(`Current: ${current}`);
      },
    };
  };

  render() {
    return (
      <div className="list-main-page">
        列表页
        {this.state.loaded ? (
          <Table
            columns={columns}
            dataSource={listStore.listData}
            pagination={this.createPagination()}
          />
        ) : null}
      </div>
    );
  }
}
