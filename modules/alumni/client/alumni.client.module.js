(function (app) {
  'use strict';

  app.registerModule('alumni', ['core']);
  app.registerModule('alumni.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
