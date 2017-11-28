(function () {
  'use strict';

  angular
    .module('employer.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('employer', {
        url: '/employer',
        templateUrl: '/modules/employer/client/views/employer.client.view.html',
        controller: 'EmployerController',
        controllerAs: 'vm',
        data: {
          roles: ['employer', 'admin']
        }
      });
  }
}());
