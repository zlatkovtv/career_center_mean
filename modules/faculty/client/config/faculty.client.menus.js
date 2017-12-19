(function () {
  'use strict';

  angular
    .module('faculty')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Manage classes',
      state: 'faculty',
      roles: ['faculty'],
      position: 1
    });
  }
}());
