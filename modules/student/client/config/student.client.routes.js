(function () {
  'use strict';

  angular
    .module('student.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('student', {
        url: '/student',
        templateUrl: '/modules/student/client/views/student.client.view.html',
        controller: 'StudentController',
        controllerAs: 'vm',
        data: {
          roles: ['student', 'admin']
        }
      });
  }
}());
