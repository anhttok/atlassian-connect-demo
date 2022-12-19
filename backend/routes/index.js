import cors from 'cors';
import fetch from 'node-fetch';
export default function routes(app, addon) {
  app.use(cors());
  //healthcheck route used by micros to ensure the addon is running.
  app.get('/healthcheck', function (req, res) {
    res.send(200);
  });

  // Root route. This route will redirect to the add-on descriptor: `atlassian-connect.json`.
  app.get('/', function (req, res) {
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
  app.get('/dog', addon.authenticate(), async (req, res) => {
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

  app.post('/uninstalled', addon.authenticate(), function (req, res) {
    addon.settings
      .del('appSettings', req.context.clientKey)
      .then(() => res.send(200));
  });
}
