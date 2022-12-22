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
  const getParameter = async ({
    clientKey,
    pageId,
    pageVersion,
    macroId,
    callback,
  }) => {
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });

    await httpClient.get(
      `/rest/api/content/${pageId}/history/${pageVersion}/macro/id/${macroId}`,
      function (err, response, contents) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
        }
        const macro = JSON.parse(contents);
        if (!macro || !macro.parameters) {
          callback(null);
        } else {
          callback(macro.parameters);
        }
      }
    );
  };
  const getPageHistory = async ({ clientKey, pageId, callback }) => {
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });
    await httpClient.get(
      `/rest/api/content/${pageId}`,
      function (err, response, contents) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
        }
        const pageContent = JSON.parse(contents);
        const historyId = pageContent.version.number;
        callback(historyId);
      }
    );
  };
  const getExcerptContent = async ({
    clientKey,
    pageId,
    historyId,
    macroId,
    res,
  }) => {
    const httpClient = addon.httpClient({
      clientKey: clientKey,
    });
    httpClient.get(
      `/rest/api/content/${pageId}/history/${historyId}/macro/id/${macroId}/convert/view`,
      function (err, response, contents) {
        if (err || response.statusCode < 200 || response.statusCode > 299) {
          console.log(err);
        }
        const macro = JSON.parse(contents);
        res.render('multi-excerpt-include-view', { body: macro.value || '' });
      }
    );
  };
  app.get(
    '/multiExcerptIncludeView',
    addon.authenticate(),
    async function (req, res) {
      const pageId = req.query['pageId'],
        pageVersion = req.query['pageVersion'],
        macroId = req.query['macroId'];
      const clientKey = req.context.clientKey;
      const callback = (parameters) => {
        if (!parameters) {
          res.render('multi-excerpt-include-view', {
            body: '',
          });
          return;
        }
        const callbackHistory = (historyId) => {
          getExcerptContent({
            clientKey,
            pageId: parameters.pageId.value,
            macroId: parameters.macroId.value,
            historyId,
            res,
          });
        };
        getPageHistory({
          clientKey,
          pageId: parameters.pageId.value,
          callback: callbackHistory,
        });
      };
      await getParameter({ clientKey, pageId, pageVersion, macroId, callback });
    }
  );
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
