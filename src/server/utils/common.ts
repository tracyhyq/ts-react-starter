/*
 * @description: 公共函数
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-21 16:10:58
 */

// tslint:disable:no-any
/**
 * 判断一个数据类型是不是 Date 类型
 * 注：不能使用 instanceOf Date 直接判断，在 nw 下会造成误判
 */
export function isDate(date: any): date is Date {
  if (!date) {
    return false;
  }
  return Object.prototype.toString.call(date) === '[object Date]';
}

export function isDateNoGuards(date: any): boolean {
  if (!date) {
    return false;
  }
  return Object.prototype.toString.call(date) === '[object Date]';
}

export function isNumber(num: any): num is number {
  return typeof num === 'number';
}

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isNull(nill: any): nill is null {
  return nill === null;
}

export function isUndefined(u: any): u is undefined {
  return typeof u === 'undefined';
}

export function isBoolean(b: any): b is boolean {
  return typeof b === 'boolean';
}

export function isFunction(f: any): f is Function {
  return typeof f === 'function';
}

export function isObject(o: any): o is Object {
  switch (true) {
    case Number.isNaN(o):
    case isString(o):
    case isNull(o):
    case isDate(o):
    case isUndefined(o):
    case isBoolean(o):
    case isFunction(o):
    case isNumber(o):
      return false;
    default:
      return true;
  }
}

export function isPromise(p: any): p is Promise<any> {
  return p && isFunction(p.then);
}
