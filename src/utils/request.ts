/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestResponse } from 'umi-request';
import { notification } from 'antd';

/* const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}; */

const codeMessage = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data was successful. ',
  202: 'A request has been queued in the background (asynchronous task). ',
  204: 'Successfully deleted data. ',
  400: 'The request sent has an error, and the server did not create or modify data. ',
  401: 'User does not have permission (token, username, password incorrect). ',
  403: 'The user is authorized, but access is forbidden. ',
  404: 'The request was made for a record that does not exist, and the server did nothing. ',
  406: 'The requested format is not available. ',
  410: 'The requested resource was permanently deleted and will no longer be available. ',
  422: 'When creating an object, a validation error occurred. ',
  500: 'A server error occurred. Please check the server. ',
  502: 'Gateway error. ',
  503: 'Service is unavailable, the server is temporarily overloaded or maintained. ',
  504: 'Gateway timed out. ',
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { data: any, response: Response }): RequestResponse => {
  const { data, response } = error;
  if (response && response.status) {
    const { status, statusText } = response;
    const errorText = codeMessage[status] || statusText;

    //notification.error({
    //  message: `Request Error ${status}`,
    //  description: errorText,
    //});
  } else if (!response) {
    notification.error({
      message: 'Network Anomaly',
      description: 'Your network is abnormal and cannot connect to the server',
    });
  }
  return { data: data, response: response };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
