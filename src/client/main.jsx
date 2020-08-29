/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import ReactDom from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
// import { client } from '@myapp/config';
import App from './App';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function renderApp(RenderedApp) {
  const history = createBrowserHistory();
  const theme = require('@myapp/default-theme');
  const rootElm = document.getElementById('react-root');
  if (rootElm) {
    ReactDom.hydrate((
      <ThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <Router history={history}>
            <RenderedApp />
          </Router>
        </StylesProvider>
      </ThemeProvider>
    ),
    rootElm);
  }
}
renderApp(App);
if (module.hot) {
  module.hot.accept(['./App.jsx'], () => {
    const NewApp = require('./App').default;
    renderApp(NewApp);
  });
}
