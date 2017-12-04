(function () {
    'use strict';

    angular
    .module('templates')
    .controller('EnrolmentController', EnrolmentController);

    EnrolmentController.$inject = ['$scope', '$uibModalInstance', 'UsersService', 'FacultyService', 'Notification', 'facultyClass'];

    function EnrolmentController($scope, $uibModalInstance, UsersService, FacultyService, Notification, facultyClass) {
        $scope.facultyClass = facultyClass;
        $scope.studentNameFilter = "";
        $scope.allStudents = [];
        $scope.enrolments = [];
        $scope.enroledStudentIds = [];

        $scope.getAllStudents = () => {
            $scope.allStudents = UsersService.getAllStudents(function (response) {
                $scope.allStudents = response;
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });

            $scope.enrolments = FacultyService.getEnrolments({ classId: $scope.facultyClass._id }, {}, function (response) {
                $scope.enrolments = response;
                $scope.enroledStudentIds = $scope.enrolments.map(entry => entry._studentId);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.addToClass = (student) => {
            FacultyService.addUserToClass({ classId: $scope.facultyClass._id }, student, function (response) {
                $scope.getAllStudents();
                Notification.success({ title: '<i class="glyphicon glyphicon-remove"></i>Success', message: 'Added ' + student.displayName + ' to the class!' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.close = () => {
            $uibModalInstance.close();
        };

        $scope.nonEnrolled = (student) => {
            if ($scope.enroledStudentIds.indexOf(student._id) !== -1) {
                return false;
            }

            if (student.displayName.toLowerCase().indexOf($scope.studentNameFilter.toLowerCase()) !== -1) {
                return true;
            }

            return false;
        };

        $scope.enrolled = (student) => {
            if ($scope.enroledStudentIds.indexOf(student._id) !== -1) {
                return true;
            }

            return false;
        };

        $scope.getAllStudents();
    }
}());
