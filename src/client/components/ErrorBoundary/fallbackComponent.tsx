/*
 * @description: 错误信息展示
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 15:48:21
 */

import * as React from 'react';
import './fallbackComponent.css';

interface Props {
  componentStack: string;
  error: Error;
}

/**
 * @name: toTitle 格式化错误信息
 * @param {type}
 * @return: string
 */
const toTitle = (error: Error, componentStack: string): string => {
  return `${error.toString()}\n\nThis is located at:${componentStack}`;
};

const FallbackComponent = ({ componentStack, error }: Props) => (
  <div className="fallback-component" title={toTitle(error, componentStack)}>
    <svg
      className="fallback-component-svg"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d={`M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,
        12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,
        12M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,
        9.5C14,8.7 14.7,8 15.5,8M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,
        8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M12,14C13.75,14 15.29,14.72 16.19,
        15.81L14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,
        17.23L7.81,15.81C8.71,14.72 10.25,14 12,14Z`}
      />
    </svg>
  </div>
);

export default FallbackComponent;
