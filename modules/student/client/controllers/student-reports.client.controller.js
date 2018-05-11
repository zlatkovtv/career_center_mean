(function () {
    'use strict';

    angular
    .module('student')
    .controller('StudentReportsController', StudentReportsController);

    StudentReportsController.$inject = ['$scope', 'Authentication', 'FacultyService', 'Notification', '$sce', '$uibModal'];

    function StudentReportsController($scope, Authentication, FacultyService, Notification, $sce, $uibModal) {
        $scope.user = Authentication.user;
        $scope.getTranscriptsForStudent = function() {
            $scope.transcripts = FacultyService.getTranscriptsByStudentId({ studentId: $scope.user._id }, {}, function (response) {
                $scope.transcripts = response;
                console.log($scope.transcripts);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve grade for some reason!' });
            });
        }

        $scope.generateTranscriptPdf = () => {
            $scope.report = {};
            $scope.report = FacultyService.generateTranscriptPdf(function (response) {
                if(response.statusCode === 204) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                        controller: 'ConfirmController',
                        resolve: {
                            options: {
                                title: 'You have no transcripts on record. Please contact your professor to add you to classes and to enter your transcripts.',
                                yes: 'Close',
                                yesColor: 'primary',
                            }
                        }
                    });

                    return;
                }

                var file = new Blob([response.data], { type: 'application/pdf' });
                var fileUrl = window.URL.createObjectURL(file);
                $scope.report = $sce.trustAsResourceUrl(fileUrl);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileUrl;
                a.download = "official_transcript.pdf";
                a.click();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.getTranscriptsForStudent();
    }
}());
