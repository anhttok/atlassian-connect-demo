import { AddOn } from 'atlassian-connect-express';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import { MacroParameters } from '../../@types';
import { getExcerptContent, getPageHistory, getParameter } from '../../helpers/macro.helper';

export default function macroRouters(app: Express, addon: AddOn) {
  const isAuthenticated = addon.authenticate();

  app.get('/macro/multiExcerptIncludeEditor', isAuthenticated, function (req, res) {
    res.render('multi-excerpt-include-editor', {
      body: 'ok',
    });
  });

  app.get(
    '/macro/multiExcerptIncludeView',
    isAuthenticated,
    async function (req: Request, res: Response) {
      const pageId = req.query['pageId'],
        pageVersion = req.query['pageVersion'],
        macroId = req.query['macroId'];
      const clientKey = req.context.clientKey;
      try {
        const parameters: MacroParameters = await getParameter({
          clientKey,
          pageId: pageId as string,
          pageVersion: pageVersion as string,
          macroId: macroId as string,
          addon,
        });
        if (!parameters || Object.keys(parameters).length === 0) {
          throw Error('Get excerpt failed');
        }
        const historyId: string = await getPageHistory({
          clientKey,
          pageId: parameters?.pageId.value,
          addon,
        });

        if (!historyId) {
          throw Error('Get excerpt failed');
        }
        const pageContent = await getExcerptContent({
          clientKey,
          pageId: parameters.pageId.value,
          macroId: parameters.macroId.value,
          historyId,
          addon,
        });
        res.render('multi-excerpt-include-view', { body: pageContent || '' });
      } catch (error: any) {
        res.render('multi-excerpt-include-view', { body: error.message || '' });
      }
    },
  );
  app.get('/macro/multiExcerpt', isAuthenticated, function (req, res) {
    const pageId = req.query['pageId'],
      pageVersion = req.query['pageVersion'],
      macroId = req.query['macroId'];

    const clientKey = req.context.clientKey;
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });

    httpClient.get(
      '/rest/api/content/' + pageId + '/history/' + pageVersion + '/macro/id/' + macroId,
      function (err: string, response: { statusCode: number }, contents: string) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          res.render('<strong>An error has occurred : ' + response.statusCode + '</strong>');
        }
        const data = JSON.parse(contents);
        res.render('multi-excerpt', {
          body: data.body,
        });
      },
    );
  });
}
