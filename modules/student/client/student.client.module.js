(function (app) {
  'use strict';

  app.registerModule('student', ['core']);
  app.registerModule('student.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
