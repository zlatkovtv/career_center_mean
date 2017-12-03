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
        templateUrl: '/modules/faculty/client/views/faculty.client.view.html',
        controller: 'FacultyController',
        controllerAs: 'vm',
        data: {
          roles: ['faculty', 'admin']
        }
      });
  }
}());
