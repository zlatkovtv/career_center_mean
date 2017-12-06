(function () {
  'use strict';

  angular
    .module('inbox.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inbox', {
        url: '/inbox',
        templateUrl: '/modules/inbox/client/views/inbox.client.view.html',
        controller: 'InboxController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'student', 'employer']
        }
      });
  }
}());
