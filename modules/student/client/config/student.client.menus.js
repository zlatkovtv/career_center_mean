(function () {
  'use strict';

  angular
    .module('student')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Student',
      state: 'student',
      roles: ['student'],
      position: 1
    });
  }
}());
