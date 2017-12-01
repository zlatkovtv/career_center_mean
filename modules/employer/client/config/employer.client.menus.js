(function () {
  'use strict';

  angular
    .module('employer')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Company profile',
      state: 'employer',
      roles: ['employer'],
      position: 1
    });
  }
}());
