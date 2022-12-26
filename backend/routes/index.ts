import { AddOn } from 'atlassian-connect-express';
import cors from 'cors';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import macroRouters from './macro';
import restRouters from './rest';

export default function routes(app: Express, addon: AddOn) {
  app.use(cors());
  // healthcheck route used by micros to ensure the addon is running.
  app.get('/healthcheck', function (req: Request, res: Response) {
    res.send(200);
  });

  // Root route. This route will redirect to the add-on descriptor: `atlassian-connect.json`.
  app.get('/', function (req: Request, res: Response) {
    res.format({
      // If the request content-type is text-html, it will decide which to serve up
      'text/html'() {
        res.redirect('/atlassian-connect.json');
      },
      // This logic is here to make sure that the `atlassian-connect.json` is always
      // served up when requested by the host
      'application/json'() {
        res.redirect('/atlassian-connect.json');
      },
    });
  });

  app.post('/uninstalled', addon.authenticate(), function (req: Request, res: Response) {
    addon.settings.del('appSettings', req.context.clientKey).then(() => res.send(200));
  });

  macroRouters(app, addon);
  restRouters(app, addon);
}
