(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Job market',
      state: 'articles',
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Jobs',
      state: 'articles.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Internships',
      state: 'articles.list',
      roles: ['*']
    });
  }
}());
