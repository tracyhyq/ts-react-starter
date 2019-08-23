/*
 * @description: 快速定位组件的的报错信息
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 15:56:16
 */

import * as React from 'react';
import FallbackComponent from './fallbackComponent';

// tslint:disable:no-any
interface Props {
  children?: any;
  FallbackComponent: React.ComponentType<any>;
  onError?: (error: Error, componentStack: string) => void;
}

interface ErrorInfo {
  componentStack: string;
}

interface State {
  error?: Error;
  info?: ErrorInfo;
}

/**
 * @name: 默认使用方式
 *
 *  <ErrorBoundary>
 *    <ComponentThatMayError />
 *  </ErrorBoundary>
 *
 * @param {type}
 * @return:
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  static defaultProps = {
    FallbackComponent,
  };

  state = {
    error: undefined,
    info: {
      componentStack: '',
    },
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError } = this.props;
    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info.componentStack);
      } catch (ignoredError) {
        console.log(ignoredError);
      }
    }

    this.setState({
      error,
      info,
    });
  }

  render() {
    const { children, FallbackComponent } = this.props;
    const { error, info } = this.state;
    if (error) {
      return (
        <FallbackComponent componentStack={info.componentStack} error={error} />
      );
    }

    return children || null;
  }
}

/**
 * @name: 高阶函数封装，使用方法如下：
 *
 *  const ComponentWithErrorBoundary = withErrorBoundary(
 *     ComponentThatMayError,
 *     ErrorBoundaryFallbackComponent, // Or pass in your own fallback component
 *     onErrorHandler: (error, componentStack) => {
 *       // Do something with the error
 *       // E.g. log to an error logging client here
 *     },
 *   );
 *
 *  <ComponentWithErrorBoundary />
 *
 * @param {type}
 * @return: Function
 */
export const withErrorBoundary = (
  Component: React.ComponentType,
  FallbackComponent: React.ComponentType,
  onError: (error: Error, componentStack: string) => void
): Function => {
  const Wrapped = (props: any) => {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  const name = Component.displayName || Component.name;
  Wrapped.displayName = name
    ? `WithErrorBoundary(${name})`
    : 'WithErrorBoundary';

  return Wrapped;
};
