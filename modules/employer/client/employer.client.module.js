(function (app) {
  'use strict';

  app.registerModule('employer', ['core']);
  app.registerModule('employer.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
