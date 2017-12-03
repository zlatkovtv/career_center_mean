(function () {
  'use strict';

  angular
    .module('employer')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Company profile',
      state: 'employer',
      type: 'dropdown',
      roles: ['employer', 'admin'],
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'employer', {
      title: 'Edit company profile',
      state: 'employer.profile',
      roles: ['employer', 'admin'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'employer', {
      title: 'Manage created ads',
      state: 'employer.created',
      roles: ['employer', 'admin'],
      position: 1
    });
  }
}());
