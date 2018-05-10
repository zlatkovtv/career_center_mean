(function () {
    'use strict';

    angular
    .module('templates')
    .controller('EnrolmentController', EnrolmentController);

    EnrolmentController.$inject = ['$scope', '$uibModal', '$uibModalInstance', 'UsersService', 'FacultyService', 'Notification', 'facultyClass'];

    function EnrolmentController($scope, $uibModal, $uibModalInstance, UsersService, FacultyService, Notification, facultyClass) {
        $scope.facultyClass = facultyClass;
        $scope.studentNameFilter = "";
        $scope.allStudents = [];
        $scope.enrolments = [];
        $scope.enroledStudentIds = [];
        $scope.isTranscriptContainerShown = false;
        $scope.selectedStudentTranscript = {};
        $scope.transcriptModalInstance = {};

        $scope.getAllStudents = () => {
            $scope.allStudents = UsersService.getAllStudents(function (response) {
                $scope.allStudents = response;
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });

            $scope.enrolments = FacultyService.getEnrolments({ classId: $scope.facultyClass._id }, {}, function (response) {
                $scope.enrolments = response;
                $scope.enroledStudentIds = $scope.enrolments.map(entry => entry.student);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.addToClass = (student) => {
            FacultyService.addUserToClass({ classId: $scope.facultyClass._id }, student, function (response) {
                $scope.getAllStudents();
                Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i>Success', message: 'Added ' + student.displayName + ' to the class!' });
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

        $scope.showTranscriptContainer = (student) => {
            $scope.isTranscriptContainerShown = true;
            $scope.selectedStudentTranscript.enrolment = $scope.enrolments.filter(function (enrolment) {
                return enrolment.student === student._id;
            })[0]._id;

            console.log($scope.selectedStudentTranscript.enrolment);
            $scope.selectedStudentTranscript.grade = FacultyService.getTranscript({ enrolmentId: $scope.selectedStudentTranscript.enrolment }, {}, function (response) {
                $scope.selectedStudentTranscript.grade = response.grade;

                popTranscriptModal();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve grade for some reason!' });
            });

            function popTranscriptModal() {
                $scope.transcriptModalInstance = $uibModal.open({
                    templateUrl: '/modules/templates/client/views/transcript-input.client.modal.html',
                    controller: 'TranscriptInputController',
                    resolve: {
                        grade: $scope.selectedStudentTranscript.grade
                    }
                });
    
                $scope.transcriptModalInstance.result.then(function (result) {
                    if (!result) {
                        return;
                    }
    
                    $scope.selectedStudentTranscript.grade = result;
                    FacultyService.saveStudentTranscript({}, $scope.selectedStudentTranscript, function (response) {
                        Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i>Success', message: 'Saved grade for ' + student.displayName + '!' });
                    }, function (response) {
                        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not save grade for some reason!' });
                    });
                }, function () {
                });
            }
        };

        $scope.getAllStudents();
    }
}());
