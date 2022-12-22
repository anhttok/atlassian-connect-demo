import baseAxios, { AxiosInstance } from 'axios';

import { getJwt } from './getJwt';
const APP_BACKEND_URL = '';
let jwt = getJwt();
if (!jwt) {
  console.error('JWT token not found');
}
const axios: AxiosInstance = baseAxios.create({
  baseURL: APP_BACKEND_URL,
  headers: {
    Authorization: 'JWT ' + (jwt ?? ''),
  },
  withCredentials: true,
});
export { axios };
const refreshJWT = async () => {
  const res = await fetch('/api/issue/refreshjwt', {
    headers: { Authorization: 'JWT ' + (jwt ?? '') },
  });
  if (res.status === 200) {
    res.json().then((json) => {
      const token = json['token'];
      jwt = token;
    });
  }
};
setInterval(refreshJWT, 150000);
