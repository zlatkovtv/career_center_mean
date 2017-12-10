(function () {
    'use strict';

    angular
    .module('student')
    .controller('StudentController', StudentController);

    StudentController.$inject = ['$scope', '$timeout', 'Authentication', 'Upload', '$location', 'Notification', 'UsersService'];

    function StudentController($scope, $timeout, Authentication, Upload, $location, Notification, UsersService) {
        $scope.progressLabel = "Profile information";
        $scope.showAlert = true;
        $scope.user = Authentication.user;
        $scope.isContinueEnabled = true;
        $scope.wizardProgress = $scope.user.studentMetadata.isPersonalProfileCompleted ? 5 : 1;
        $scope.progressPercent = $scope.wizardProgress * 20;

        $scope.files = {
            cv: {},
            motivation: {},
            recommendation: {},
            additionalDocument: {}
        };

        if ($scope.user.studentMetadata.cv) {
            $scope.files.cv.name = $scope.user.studentMetadata.cv.filename;
        }

        if ($scope.user.studentMetadata.motivation) {
            $scope.files.motivation.name = $scope.user.studentMetadata.motivation.filename;
        }

        if ($scope.user.studentMetadata.recommendation) {
            $scope.files.recommendation.name = $scope.user.studentMetadata.recommendation.filename;
        }

        if ($scope.user.studentMetadata.additionalDocument) {
            $scope.files.additionalDocument.name = $scope.user.studentMetadata.additionalDocument.filename;
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

        $scope.closeWizardAlert = () => {
            return "";
        };

        $scope.closeWizardAlert = () => {
            $scope.showAlert = false;
        };

        $scope.validateCurrentForm = () => {
            if (!$scope.user.studentMetadata.firstName || !$scope.user.studentMetadata.lastName || !$scope.user.email || !$scope.user.studentMetadata.personality) {
                $scope.isContinueEnabled = false;
                return;
            }

            $scope.isContinueEnabled = true;
        };

        $scope.continue = () => {
            if ($scope.wizardProgress === 5) {
                return;
            }

            if ($scope.wizardProgress === 4) {
                // save user personal info progress
                $scope.user.studentMetadata.isPersonalProfileCompleted = true;
                console.log($scope.user);
                var userService = new UsersService($scope.user);
                userService.$update(function (response) {
                    Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> You have successfully completed your profile!', delay: 3000 });
                    Authentication.user = response;
                    saveUserFiles();
                }, function (response) {
                    Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
                });

            }

            $scope.wizardProgress++;
            $scope.progressPercent = $scope.wizardProgress * 20;
        };

        function saveUserFiles() {
            var filesToPost = {
                "newProfilePicture": $scope.files.picFile,
                "cv": $scope.files.cv,
                "motivation": $scope.files.motivation,
                "recommendation": $scope.files.recommendation,
                "additionalDocument": $scope.files.additionalDocument
            };

            for (var fileName in filesToPost) {
                if (filesToPost.hasOwnProperty(fileName)) {
                    if (!filesToPost[fileName] || !filesToPost[fileName].size) {
                        continue;
                    }

                    Upload.upload({
                        url: '/api/users/files',
                        method: 'POST',
                        data: {
                            file: filesToPost[fileName],
                            'fieldName': fileName
                        }
                    });
                }
            }
        }

        $scope.goBack = () => {
            if ($scope.wizardProgress === 1) {
                return;
            }

            $scope.user.studentMetadata.isPersonalProfileCompleted = false;
            $scope.wizardProgress--;
            $scope.progressPercent = $scope.wizardProgress * 20;
        };

        $scope.startOver = () => {
            $scope.wizardProgress = 1;
            $scope.progressPercent = $scope.wizardProgress * 20;
            $scope.user.studentMetadata.isPersonalProfileCompleted = false;
        };

        $scope.goToJobsPage = () => {
            $location.url('jobs/all');
        };

        $scope.validateCurrentForm();

        function onSuccessItem(response) {
          $scope.user = Authentication.user = response;
        }
    }
}());
