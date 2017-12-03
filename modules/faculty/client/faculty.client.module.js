(function (app) {
  'use strict';

  app.registerModule('faculty', ['core']);
  app.registerModule('faculty.routes', ['ui.router', 'core.routes']);
  app.registerModule('faculty.services');
}(ApplicationConfiguration));
