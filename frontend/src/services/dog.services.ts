import { request } from '../utlis/request.util';

export const getDog = async () => {
  return request({ url: '/dog' });
};
