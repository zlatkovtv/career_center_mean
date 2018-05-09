(function (app) {
  'use strict';

  app.registerModule('jobs', ['core', 'trNgGrid']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('jobs.services');
  app.registerModule('jobs.routes', ['ui.router', 'core.routes', 'jobs.services']);
}(ApplicationConfiguration));
