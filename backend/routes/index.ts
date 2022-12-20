import { AddOn } from 'atlassian-connect-express';
import cors from 'cors';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import fetch from 'node-fetch';
export default function routes(app: Express, addon: AddOn) {
  app.use(cors());
  //healthcheck route used by micros to ensure the addon is running.
  app.get('/healthcheck', function (req: Request, res: Response) {
    res.send(200);
  });

  // Root route. This route will redirect to the add-on descriptor: `atlassian-connect.json`.
  app.get('/', function (req: Request, res: Response) {
    res.format({
      // If the request content-type is text-html, it will decide which to serve up
      'text/html': function () {
        res.redirect('/atlassian-connect.json');
      },
      // This logic is here to make sure that the `atlassian-connect.json` is always
      // served up when requested by the host
      'application/json': function () {
        res.redirect('/atlassian-connect.json');
      },
    });
  });

  app.get('/rest/api/dog', addon.checkValidToken(), async (req: Request, res: Response) => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      const textContent = response.text();
      console.log(`error while getting random dog picture: ${textContent}`);
    }

    //   const title = 'Random dog';
    const jsonContent = await response.json();
    const imageUrl = jsonContent.message;
    //   res.render('dog.hbs', { title, imageUrl });
    return res.status(200).json({ imageUrl });
  });
  app.get('/dog', addon.checkValidToken(), async (req: Request, res: Response) => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      const textContent = response.text();
      console.log(`error while getting random dog picture: ${textContent}`);
    }

    //   const title = 'Random dog';
    const jsonContent = await response.json();
    const imageUrl = jsonContent.message;
    //   res.render('dog.hbs', { title, imageUrl });
    res.render('dog', {
      imageUrl: imageUrl,
    });
  });

  app.post('/uninstalled', addon.authenticate(), function (req: Request, res: Response) {
    addon.settings.del('appSettings', req.context.clientKey).then(() => res.send(200));
  });
}
