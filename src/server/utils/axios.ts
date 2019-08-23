/*
 * @description: 基于 axios 的 http 请求封装 详细使用手册：https://www.jianshu.com/p/7a9fbcbb1114
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:10:27
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 默认超时时间 5 秒
const DEFAULT_TIMEOUT = 5000;
// 全局设置默认超时时间
axios.defaults.timeout = DEFAULT_TIMEOUT;

/**
 * 处理返回数据
 * @param res
 */
// tslint:disable:no-any
const dealRes = <T>(res: AxiosResponse<any>): T => {
  if (!res) {
    throw new Error('获取数据失败，请重试');
  }
  const { code, data } = res.data;
  if (~~code >= 400) {
    // 遇到错误，定义好错误信息的返回结构
    const error = {
      method: res.config.method,
      url: res.config.url,
      status: res.status,
      message: res.data,
    };
    throw new Error(JSON.stringify(error));
  } else {
    return data as T;
  }
};

export const HttpUtil = {
  get: async <R>(url: string, config: AxiosRequestConfig = {}): Promise<R> => {
    const res = await axios.get(url, config);
    return dealRes<R>(res);
  },
  post: async <R>(
    url: string,
    postdata?: any,
    config: AxiosRequestConfig = {}
  ): Promise<R> => {
    const res = await axios.post(url, postdata, config);
    return dealRes<R>(res);
  },
  put: async <R>(
    url: string,
    putdata?: any,
    config: AxiosRequestConfig = {}
  ): Promise<R> => {
    const res = await axios.put(url, putdata, config);
    return dealRes<R>(res);
  },
  delete: async <R>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<R> => {
    const res = await axios.delete(url, config);
    return dealRes<R>(res);
  },
};
