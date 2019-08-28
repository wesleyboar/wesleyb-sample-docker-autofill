//
// Dependencies
//

// RFE: Support different environment configurations
// require('dotenv').config();

const Koa = require('koa');
const Subdomain = require('koa-subdomain');

const app = new Koa();
const subdomain = new Subdomain();
const serve = require('koa-static');
const path = require('path');

const router = require('../api/main.js').koaRouter;

//
// Definitions
//

// If external service defines port, then so be it
const port = process.env.PORT || 9000;
// This is used to log URLs of relevant resources
// WARN: This is a real domain…
const hostname = "animal.farm";

// Directories
const staticDir = path.resolve( __dirname, '../dist/public');
const docsDir = path.resolve( __dirname, '../dist/docs');

//
// Application
//

// API requests must be sent to `api.domain.tld`; others may use any sub-domain
subdomain.use( 'www', serve( staticDir ));
subdomain.use( 'docs', serve( docsDir ));
subdomain.use( 'api', router.routes());

// WARN: Subdomain routes must be "used" first, or static server overrides them
app.use( subdomain.routes());
app.use( serve( staticDir ));

// Allow Koa to use default service configuration
app.listen( port, ( err ) => {
  if ( err ) throw err;

  console.log(`Listening on port ${port}`);

  // RFE: Support client dev server and API on same port, so CORS is not an issue
  console.log(`Client-Side Web App is available at http://www.${hostname}:${port}`);
  console.log(`Server-Side Web API is available at http://api.${hostname}:${port}`);
  console.log(`User and Dev Docs are available at http://docs.${hostname}:${port}`);
});
