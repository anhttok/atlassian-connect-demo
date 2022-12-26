import { AddOn } from 'atlassian-connect-express';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
import fetch from 'node-fetch';

export default function macroRouters(app: Express, addon: AddOn) {
  const checkValidToken = () => {
    return addon.checkValidToken();
  };
  app.get('/macro/dog-picture', checkValidToken, async (req: Request, res: Response) => {
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
