import cors from 'cors';
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

  app.get(
    '/multiExcerptIncludeEditor',
    addon.authenticate(),
    function (req, res) {
      res.render('multi-excerpt-include-editor', {
        body: 'ok',
      });
    }
  );
  app.get('/multiExcerptInclude', addon.authenticate(), function (req, res) {
    // res.render('multi-excerpt-include', { title, pageId });
    const pageId = req.query['pageId'],
      pageVersion = req.query['pageVersion'],
      macroId = req.query['macroId'];

    // Get the clientKey and use it to create an HTTP client for the REST API call
    const clientKey = req.context.clientKey;
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });
    httpClient.get(
      '/rest/api/content/' + pageId + '/property',
      function (err, response, contents) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          // res.render(
          //   '<strong>An error has occurred : ' +
          //     response.statusCode +
          //     '</strong>'
          // );
        }
        const macro = JSON.parse(contents);
        const data = [];
        var searchVal = 'appkey_macro_';
        for (var i = 0; i < macro.results.length; i++) {
          if (macro.results[i]['key'].startsWith(searchVal)) {
            var a = macro.results[i].value.response_value;
            data.push(a);
          }
        }

        console.log('contents :>> ', data);
        res.render('multi-excerpt-include', {
          body: data.join(' \n'),
        });
      }
    );
  });
  app.get('/multiExcerpt', addon.authenticate(), function (req, res) {
    // Get the macro variables passed in via the URL
    const pageId = req.query['pageId'],
      pageVersion = req.query['pageVersion'],
      macroId = req.query['macroId'];

    // Get the clientKey and use it to create an HTTP client for the REST API call
    const clientKey = req.context.clientKey;
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });

    // Call the REST API: Get macro body by macro ID
    httpClient.get(
      '/rest/api/content/' +
        pageId +
        '/history/' +
        pageVersion +
        '/macro/id/' +
        macroId,
      function (err, response, contents) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
          res.render(
            '<strong>An error has occurred : ' +
              response.statusCode +
              '</strong>'
          );
        }
        contents = JSON.parse(contents);
        res.render('multi-excerpt', {
          body: contents.body,
        });
      }
    );
  });

  app.post('/uninstalled', addon.authenticate(), function (req, res) {
    addon.settings
      .del('appSettings', req.context.clientKey)
      .then(() => res.send(200));
  });
}
