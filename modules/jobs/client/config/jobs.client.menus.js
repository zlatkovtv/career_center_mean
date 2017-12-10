(function () {
  'use strict';

  angular
    .module('jobs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Job market',
      state: 'jobs',
      type: 'dropdown',
      roles: ['student', 'employer', 'admin'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'jobs', {
      title: 'Create a job ad',
      state: 'jobs.create',
      roles: ['employer', 'admin'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'jobs', {
      title: 'Find jobs',
      state: 'jobs.find',
      roles: ['student', 'admin'],
      position: 1
    });
  }
}());
