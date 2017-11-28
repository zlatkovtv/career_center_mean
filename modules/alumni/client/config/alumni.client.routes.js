(function () {
  'use strict';

  angular
    .module('alumni.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('alumni', {
        url: '/alumni',
        templateUrl: '/modules/alumni/client/views/alumni.client.view.html',
        controller: 'AlumniController',
        controllerAs: 'vm',
        data: {
          roles: ['alumni', 'admin']
        }
      });
  }
}());
