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
        console.log($scope.user);
        $scope.wizardProgress = $scope.user.isPersonalProfileCompleted ? 5 : 1;
        $scope.progressPercent = $scope.wizardProgress * 20;
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
            if (!$scope.user.firstName || !$scope.user.lastName || !$scope.user.email || !$scope.user.personality) {
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
                $scope.user.isPersonalProfileCompleted = true;
                console.log($scope.user);
                var userService = new UsersService($scope.user);
                userService.$update(function (response) {
                    Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> You have successfully completed your profile!', delay: 3000 });
                    Authentication.user = response;
                }, function (response) {
                    Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
                });

                Upload.upload({
                    url: '/api/users/picture',
                    data: {
                        newProfilePicture: $scope.picFile
                    }
                }).then(function (response) {
                    $timeout(function () {
                      onSuccessItem(response.data);
                    });
                }, function (response) {
                }, function (evt) {
                });
            }

            $scope.wizardProgress++;
            $scope.progressPercent = $scope.wizardProgress * 20;
        };

        $scope.goBack = () => {
            if ($scope.wizardProgress === 1) {
                return;
            }

            $scope.user.isPersonalProfileCompleted = false;
            $scope.wizardProgress--;
            $scope.progressPercent = $scope.wizardProgress * 20;
        };

        $scope.startOver = () => {
            $scope.wizardProgress = 1;
            $scope.progressPercent = $scope.wizardProgress * 20;
            $scope.user.isPersonalProfileCompleted = false;
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
