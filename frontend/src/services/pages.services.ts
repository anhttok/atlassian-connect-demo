import { request } from '../utlis/request.util';

export const getDog = async () => {
  return request({ url: '/dog' });
};

export const getPages = async () => {
  return await request({
    url: 'https://anhtt-dev.atlassian.net/wiki/rest/api/search?cql=type=page&limit=25',
  });
};
export const getExcerptWithPageId = async (pageId:string) => {
  return await request({
    url: 'https://anhtt-dev.atlassian.net/wiki/rest/api/search?cql=type=page&limit=25',
  });
};
