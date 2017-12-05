(function () {
    'use strict';

    angular
    .module('student')
    .controller('StudentReportsController', StudentReportsController);

    StudentReportsController.$inject = ['$scope', 'Authentication', 'FacultyService', 'Notification'];

    function StudentReportsController($scope, Authentication, FacultyService, Notification) {
    }
}());
