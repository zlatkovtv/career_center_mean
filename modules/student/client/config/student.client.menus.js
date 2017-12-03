(function () {
  'use strict';

  angular
    .module('student')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Student profile',
      state: 'student',
      roles: ['student', 'admin'],
      position: 1
    });

    menuService.addMenuItem('topbar', {
      title: 'Reports',
      state: 'student.reports',
      roles: ['student', 'admin'],
      position: 2
    });
  }
}());
