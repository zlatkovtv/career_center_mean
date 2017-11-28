(function () {
  'use strict';

  angular
    .module('alumni')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Alumni',
      state: 'alumni',
      roles: ['alumni'],
      position: 1
    });
  }
}());
