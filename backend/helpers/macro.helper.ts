import { AddOn } from 'atlassian-connect-express';
import { MacroParameters } from '../@types';

type GetParameterType = {
  clientKey: string;
  pageId: string;
  pageVersion: string;
  macroId: string;
  addon: AddOn;
};
type GetPageHistoryType = {
  clientKey: string;
  pageId: string;
  addon: AddOn;
};
type GetExcerptContentType = {
  clientKey: string;
  pageId: string;
  historyId: string;
  macroId: string;
  addon: AddOn;
};

export const getParameter = async ({
  clientKey,
  pageId,
  pageVersion,
  macroId,
  addon,
}: GetParameterType): Promise<MacroParameters> => {
  const httpClient = addon.httpClient({
    clientKey: clientKey,
  });

  return new Promise((resolve, reject) => {
    httpClient.get(
      `/rest/api/content/${pageId}/history/${pageVersion}/macro/id/${macroId}`,
      async function (err: any, response: { statusCode: number }, contents: string) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          reject();
        }
        const macro = JSON.parse(contents);
        if (macro && macro.parameters) {
          resolve(macro.parameters);
        }
      },
    );
  });
};
export const getPageHistory = async ({
  clientKey,
  pageId,
  addon,
}: GetPageHistoryType): Promise<string> => {
  const httpClient = addon.httpClient({
    clientKey: clientKey,
  });
  return new Promise((resolve, reject) => {
    httpClient.get(
      `/rest/api/content/${pageId}`,
      function (err: any, response: { statusCode: number }, contents: string) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          reject();
          return;
        }
        const pageContent = JSON.parse(contents);
        const historyId: string = pageContent?.version?.number;
        if (!historyId) {
          reject();
          return;
        }
        resolve(historyId);
      },
    );
  });
};
export const getExcerptContent = async ({
  clientKey,
  pageId,
  historyId,
  macroId,
  addon,
}: GetExcerptContentType) => {
  const httpClient = addon.httpClient({
    clientKey: clientKey,
  });

  return new Promise((resolve, reject) => {
    httpClient.get(
      `/rest/api/content/${pageId}/history/${historyId}/macro/id/${macroId}/convert/view`,
      function (err: any, response: { statusCode: number }, contents: string) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          reject();
          return;
        }
        const macro = JSON.parse(contents);
        return resolve(macro.value);
      },
    );
  });
};
