(function () {
  'use strict';

  angular
    .module('jobs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('jobs', {
        abstract: true,
        url: '/jobs',
        template: '<ui-view/>'
      })
      .state('jobs.find', {
        url: '/all',
        templateUrl: '/modules/jobs/client/views/jobs-find.client.view.html',
        controller: 'JobsFindController',
        controllerAs: 'vm'
      })
      .state('jobs.create', {
        url: '/create',
        templateUrl: '/modules/jobs/client/views/jobs-create.client.view.html',
        controller: 'JobsCreateController',
        controllerAs: 'vm'
      })
      .state('jobs.detail', {
        url: '/:jobId',
        templateUrl: '/modules/jobs/client/views/jobs-detail.client.view.html',
        controller: 'JobsDetailController',
        controllerAs: 'vm'
      });
  }

  getJob.$inject = ['$stateParams', 'JobsService'];

  function getJob($stateParams, JobsService) {
    return JobsService.get({
      jobId: $stateParams.jobId
    }).$promise;
  }
}());
