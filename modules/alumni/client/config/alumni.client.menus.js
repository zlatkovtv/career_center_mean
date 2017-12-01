(function () {
  'use strict';

  angular
    .module('alumni')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'View and edit student profiles',
      state: 'alumni',
      roles: ['alumni'],
      position: 1
    });
  }
}());
