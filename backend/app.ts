import { loadEnvironment } from './config/environment';

loadEnvironment();

// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
// https://expressjs.com
import express from 'express';

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

// atlassian-connect-express also provides a middleware
import ace from 'atlassian-connect-express';

// Use Handlebars as view engine:
// https://npmjs.org/package/express-hbs
// http://handlebarsjs.com
import hbs from 'express-hbs';

// We also need a few stock Node modules
import http from 'http';
import path from 'path';
import os from 'os';
import helmet from 'helmet';
import nocache from 'nocache';

// Routes live here; this is the C in MVC
import routes from './routes';
import { addServerSideRendering } from './server-side-rendering';

// Bootstrap Express and atlassian-connect-express
const app = express();
const addon = ace(app);

// See config.json
const port = addon.config.port();
app.set('port', port);

// Log requests, using an appropriate formatter by env
const devEnv = app.get('env') === 'development';
app.use(morgan(devEnv ? 'dev' : 'combined'));

const accessDir = devEnv ? path.join(__dirname, '..') : __dirname;

// We don't want to log JWT tokens, for security reasons
morgan.token('url', redactJwtTokens);

// Configure Handlebars
const viewsDir = path.join(accessDir, 'views');
const handlebarsEngine = hbs.express4({ partialsDir: viewsDir });
app.engine('hbs', handlebarsEngine);
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// Configure jsx (jsx files should go in views/ and export the root component as the default export)
addServerSideRendering(app, handlebarsEngine);

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
// HSTS must be enabled with a minimum age of at least one year
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: false,
  }),
);
app.use(
  helmet.referrerPolicy({
    policy: ['origin'],
  }),
);

// Include request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Gzip responses when appropriate
app.use(compression());

// Include atlassian-connect-express middleware
app.use(addon.middleware());

// Mount the static files directory
const staticDir = path.join(accessDir, 'public');
app.use(express.static(staticDir));

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
app.use(nocache());

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler());

// Wire up routes
routes(app, addon);

// Boot the HTTP server
http.createServer(app).listen(port, () => {
  console.info('App server running at: ' + addon.config.localBaseUrl());
  console.info(`Port: ${addon.config.port()}`);
  // TODO check
  // Enables auto registration/de-registration of app into a host in dev mode
  // if (devEnv) addon.register();
});

function redactJwtTokens(req: any) {
  const url = req.originalUrl || req.url || '';
  const params = new URLSearchParams(url);
  let redacted = url;
  params.forEach((value, key) => {
    if (key.toLowerCase() === 'jwt') {
      redacted = redacted.replace(value, 'redacted');
    }
  });
  return redacted;
}
