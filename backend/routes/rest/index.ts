// TODO remove
// @ts-nocheck
import { AddOn } from 'atlassian-connect-express';
import { Request, Response } from 'express';
import { Express } from 'express-serve-static-core';
export default function restRouters(app: Express, addon: AddOn) {
  app.get('/rest/api/dog', addon.checkValidToken(), async (req: Request, res: Response) => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
      const textContent = response.text();
      console.log(`error while getting random dog picture: ${textContent}`);
    }
    const jsonContent = await response.json();
    const imageUrl = jsonContent.message;
    return res.status(200).json({ imageUrl });
  });
}
