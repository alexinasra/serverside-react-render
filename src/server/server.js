import path from 'path';
import express from 'express';
import config from '@myapp/config';
import logger from '@myapp/logger';
import React from 'react';
import { StaticRouter } from "react-router";
import { create } from 'jss';
import rtl from 'jss-rtl';
import { ServerStyleSheets, StylesProvider, ThemeProvider, jssPreset } from '@material-ui/core/styles';
import { fs } from 'memfs';
const ReactDOMServer = require('react-dom/server');
var serveStatic = require('serve-static')

const production = (process.env.NODE_ENV === "production");
const development = (process.env.NODE_ENV === "development");

const app = express();

logger.info(`Starting server in ${production? 'production': 'development'} mode .`);

// set the view engine to ejs
app.set('view engine', 'ejs');

if(development) {
  logger.info("Starting webpack compiler.");
  const webpack = require('webpack');
  const webpackConf = require('../../webpack-dev.config.js');
  const webpackCompiler = webpack(webpackConf);

  const webpackDevMiddleware = require('webpack-dev-middleware');

  webpackCompiler.outputFileSystem = fs;
  app.use(webpackDevMiddleware(webpackCompiler, {
      outputFileSystem: fs,
      publicPath: webpackConf.output.publicPath,
  }));
  app.use(require("webpack-hot-middleware")(webpackCompiler));
} else {
  app.use('/assets', serveStatic(path.join(__dirname, '../../assets/')));
}


app.get('/*', (req, res) => {
  const theme = require(config.client.theme);
  const sheets = new ServerStyleSheets();
  let App = require('../client/App').default;
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  let context = {};
  let body = ReactDOMServer.renderToString(sheets.collect((
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </StylesProvider>
    </ThemeProvider>
    )));
  let css = sheets.toString();

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
      res.writeHead(302, {
          Location: context.url
      });
      res.end();
  } else {
      res.render('index', {
        serverCss: css,
        serverBody: body
      });
  }
});
app.listen(8080);
