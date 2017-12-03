(function () {
  'use strict';

  angular
    .module('faculty')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'View and edit student profiles',
      state: 'faculty',
      roles: ['faculty'],
      position: 1
    });
  }
}());
