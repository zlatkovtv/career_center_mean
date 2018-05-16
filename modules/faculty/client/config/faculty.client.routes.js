(function () {
  'use strict';

  angular
    .module('faculty.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('faculty', {
        url: '/faculty',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('faculty.manage', {
        url: '/manage',
        templateUrl: '/modules/faculty/client/views/faculty.client.view.html',
        controller: 'FacultyController',
        controllerAs: 'vm',
        data: {
          roles: ['faculty', 'admin']
        }
      }).state('faculty.statistics', {
        url: '/statistics',
        templateUrl: '/modules/faculty/client/views/faculty-statistics.client.view.html',
        controller: 'FacultyStatisticsController',
        controllerAs: 'vm',
        data: {
          roles: ['faculty', 'admin']
        }
      });
  }
}());
