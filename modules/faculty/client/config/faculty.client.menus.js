(function () {
  'use strict';

  angular
    .module('faculty')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Statistics',
      state: 'faculty.statistics',
      roles: ['faculty', 'admin'],
      position: 1
    });

    menuService.addMenuItem('topbar', {
      title: 'Manage classes',
      state: 'faculty.manage',
      roles: ['faculty', 'admin'],
      position: 2
    });
  }
}());
