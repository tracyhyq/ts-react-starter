/*
 * @description: 防重复点击工具函数
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 15:57:31
 */

// tslint:disable:no-any
export function isFunction(f: any): f is Function {
  return typeof f === 'function';
}

/**
 * 必须等到promise上一次返回后，再次触发才回有效，用于防止点击事件暴击
 * @param func
 */
export const guard = (func: Function) => {
  if (!isFunction(func)) {
    return func;
  }

  let isRunning = false;
  function f(...args: any[]) {
    if (isRunning) {
      console.log('running, try later!');
      return;
    }

    isRunning = true;
    const result = func(...args);
    if (result && result.then) {
      result
        .then((res: any) => {
          isRunning = false;
          return res;
        })
        .catch(() => {
          isRunning = false;
        });
    } else {
      isRunning = false;
    }

    return result;
  }

  return f;
};
