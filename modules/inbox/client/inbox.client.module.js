(function (app) {
  'use strict';

  app.registerModule('inbox', ['core']);
  app.registerModule('inbox.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
