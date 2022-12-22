import { AxiosRequestConfig } from 'axios';
import { axios } from './axios.util';
import { getMeta } from './getMeta';
export type RequestParams = AxiosRequestConfig;
const baseUrl = getMeta('ap-local-base-url') || '';

export const request = async ({
  url = '',
  method = 'get',
  params = {},
  data,
  headers = {},
  ...props
}: RequestParams) => {
  const fixedParams = Object.keys(params).reduce((obj, key) => {
    if (params[key] !== undefined) {
      obj[key] = params[key];
    }
    return obj;
  }, {} as any);
  // eslint-disable-next-line no-useless-catch
  if (!url.startsWith('https://')) {
    url = `${baseUrl}/rest/api${url}`;
  }
  else {
    url = `${url}`;
  }
  try {
    const result = await axios({
      url,
      method,
      data,
      params: fixedParams,
      headers: {
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        ...headers,
      },
      ...props,
    });
    return result;
  } catch (err: any) {
    throw err;
  }
};
