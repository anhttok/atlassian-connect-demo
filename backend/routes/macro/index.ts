// TODO remove
// @ts-nocheck
import { AddOn } from 'atlassian-connect-express';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';

export default function macroRouters(app: Express, addon: AddOn) {
  app.get('/macro/dog-picture', addon.checkValidToken(), async (req: Request, res: Response) => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      const textContent = response.text();
      console.log(`error while getting random dog picture: ${textContent}`);
    }
    const jsonContent = await response.json();
    const imageUrl = jsonContent.message;
    res.render('dog-picture', {
      imageUrl,
    });
  });
}
