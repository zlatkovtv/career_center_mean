(function () {
    'use strict';

    angular
    .module('templates')
    .controller('EnrolmentController', EnrolmentController);

    EnrolmentController.$inject = ['$scope', '$uibModalInstance', 'UsersService', 'FacultyService', 'Notification', 'facultyClass'];

    function EnrolmentController($scope, $uibModalInstance, UsersService, FacultyService, Notification, facultyClass) {
        $scope.facultyClass = facultyClass;
        $scope.studentNameFilter = "";
        $scope.allStudents = {};
        $scope.enrolments = {};

        $scope.getAllStudents = () => {
            $scope.allStudents = UsersService.getAllStudents(function (response) {
                $scope.allStudents = response;
                console.log($scope.allStudents);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });

            $scope.enrolments = FacultyService.getEnrolments({ classId: $scope.facultyClass._id }, {}, function (response) {
                $scope.enrolments = response;
                console.log($scope.allStudents);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.addToClass = (student) => {
            $scope.allStudents = FacultyService.addUserToClass({ classId: $scope.facultyClass._id }, student, function (response) {
                Notification.success({ title: '<i class="glyphicon glyphicon-remove"></i>Success', message: 'Added ' + student.displayName + ' to the class!' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.close = () => {
            $uibModalInstance.close();
        };

        $scope.getAllStudents();
    }
}());
