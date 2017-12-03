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
            abstract: true,
            template: '<ui-view/>'
        })
        .state('employer.profile', {
            url: '/profile',
            templateUrl: '/modules/employer/client/views/employer-profile.client.view.html',
            controller: 'EmployerProfileController',
            controllerAs: 'vm'
        })
        .state('employer.created', {
            url: '/created',
            templateUrl: '/modules/employer/client/views/employer-created.client.view.html',
            controller: 'EmployerCreatedController',
            controllerAs: 'vm'
        });
    }
}());
