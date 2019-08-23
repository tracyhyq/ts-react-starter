/*
 * @description: 基于 Winston，实现日志基类
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-14 17:35:18
 */

import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as moment from 'moment-timezone';
import { IOption } from './types';

const { combine, timestamp, label, prettyPrint, printf } = format;

/**
 * 自定义 format
 */
const myFormat = printf((info) => {
  return `[${moment()
    .tz('Asia/Shanghai')
    .format('YYYY-MM-DD HH:mm:ss.SSS')}] [${info.level}] ${info.label} - ${
    info.message
  }`;
});

const DEFAULT_INFO_OPT = {
  filename: 'out-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '1g',
  maxFiles: '15d',
};

const DEFAULT_ERROR_OPT = {
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '1g',
  maxFiles: '15d',
};

export default function(option?: IOption) {
  const infoRotateOpt = option
    ? Object.assign({}, DEFAULT_INFO_OPT, option.info)
    : DEFAULT_INFO_OPT;
  const errorRotateOpt = option
    ? Object.assign({}, DEFAULT_ERROR_OPT, option.error)
    : DEFAULT_ERROR_OPT;
  return {
    info: createLogger({
      format: combine(
        label({ label: 'NODE-LOGGER' }),
        timestamp(),
        prettyPrint(),
        myFormat
      ),
      transports: [
        new transports.Console(),
        new DailyRotateFile(infoRotateOpt),
      ],
    }),
    error: createLogger({
      format: combine(
        label({ label: 'NODE-LOGGER' }),
        timestamp(),
        prettyPrint(),
        myFormat
      ),
      transports: [
        new transports.Console(),
        new DailyRotateFile(errorRotateOpt),
      ],
    }),
  };
}
