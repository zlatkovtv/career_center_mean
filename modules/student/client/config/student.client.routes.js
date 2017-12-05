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
            abstract: true,
            template: '<ui-view/>'
        })
        .state('student.profile', {
            url: '/profile',
            templateUrl: '/modules/student/client/views/student.client.view.html',
            controller: 'StudentController',
            controllerAs: 'vm',
            data: {
                roles: ['student', 'admin']
            }
        })
        .state('student.reports', {
            url: '/reports',
            templateUrl: '/modules/student/client/views/student-reports.client.view.html',
            controller: 'StudentReportsController',
            controllerAs: 'vm',
            data: {
                roles: ['student', 'admin']
            }
        });
    }
}());
