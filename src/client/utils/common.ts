/**
 * @description 常用的工具函数
 * @author tracyqiu
 * @date 2019-8-8
 */

/**
 * 数字千分位
 * @param input
 */
export const thousandsFormat = (input: number) => {
  return (
    input &&
    input
      .toString()
      .replace(/(^|\s)-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  );
};

/**
 * 获取 URL 中的参数
 * @param name
 */
export const getParameterByName = (name: string) => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
