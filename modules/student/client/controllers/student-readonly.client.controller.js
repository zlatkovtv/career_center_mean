(function () {
    'use strict';

    angular
    .module('student')
    .controller('StudentReadonlyController', StudentReadonlyController);

    StudentReadonlyController.$inject = ['$scope', '$timeout', 'Authentication', 'Upload', '$location', 'Notification', 'UsersService', '$stateParams', '$sce', 'FacultyService', '$uibModal'];

    function StudentReadonlyController($scope, $timeout, Authentication, Upload, $location, Notification, UsersService, $stateParams, $sce, FacultyService, $uibModal) {
        $scope.progressLabel = "Profile information";
        $scope.user = UsersService.getUser({ userId: $stateParams.userId }, {}, function(response) {
            $scope.user = response;
        });

        $scope.downloadFile = function(inputFile) {
            if(!inputFile) {
                return;
            }

            $scope.report = UsersService.downloadFileById({ fileId: inputFile._id}, {}, function (response) {
                var file = new Blob([response.data], { type: 'application/pdf' });
                var fileUrl = window.URL.createObjectURL(file);
                $scope.report = $sce.trustAsResourceUrl(fileUrl);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileUrl;
                a.download = inputFile.filename;
                a.click();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not download file!' });
            });
        }

        $scope.programmingLanguages = [
            'C#', 'Java', 'C++', 'C', 'JavaSript', 'Python', 'PHP', 'Go', 'Ruby', 'CSS/Sass/Less', 'HTML/Pug/other markup language', 'Other'
        ];
        $scope.technicalSkills = [
            'Operating systems', 'Algorithms and Data Structures', 'Maths/Calculus', 'Microsoft Office', 'Hardware', 'Other'
        ];
        $scope.softSkills = [
            'Communication', 'Leadership', 'Time management', 'Voluntary', 'Other'
        ];

        $scope.downloadTranscript = function() {
            $scope.report = {};
            $scope.report = FacultyService.generateAllTranscriptPdf({}, {}, function (response) {
                if(response.statusCode === 204) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                        controller: 'ConfirmController',
                        resolve: {
                            options: {
                                title: 'Student has no transcripts on record.',
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
        }
    }
}());
