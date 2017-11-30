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
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'jobs', {
      title: 'Find jobs',
      state: 'jobs.find',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'jobs', {
      title: 'Create a job ad',
      state: 'jobs.create',
      roles: ['employer', 'admin']
    });
  }
}());
