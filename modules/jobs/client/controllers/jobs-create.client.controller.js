(function () {
    'use strict';

    angular
        .module('jobs')
        .controller('JobsCreateController', JobsCreateController);

    JobsCreateController.$inject = ['$scope', 'JobsService', 'Notification', 'Authentication', '$uibModal', '$location'];

    function JobsCreateController($scope, JobsService, Notification, Authentication, $uibModal, $location) {
        $scope.employer = Authentication.user;
        $scope.freeLimit = 3;
        $scope.canEditCompanyFields = false;
        $scope.jobTypes =
        {
            'fulltime': 'Full-time',
            'parttime': 'Part-time',
            'internship': 'Internship'
        };
        $scope.jobCategories =
        {
            "business": "Business",
            "design": "Design/Creative",
            "education": "Educator/Training",
            "production": "Production",
            "media": "Media",
            "software": "Software",
            "supplyChain": "Supply chain",
            "management": "Management",
            "quality": "Quality Assurance",
            "support": "Support",
            "admin": "System administrator",
            "networking": "Networking"
        };
        $scope.jobLevels =
        {
            'management': 'Management level',
            'specialist': 'Specialist level',
            'worker': 'Worker level'
        };

        $scope.verifyEmployerProfileCompleted = () => {
            if (!$scope.employer.employerMetadata.companyName || !$scope.employer.employerMetadata.companyWebsite || !$scope.employer.employerMetadata.companyPhone) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                    controller: 'ConfirmController',
                    resolve: {
                        options: {
                            title: 'You need to complete your company profile before you can create job ads.',
                            yes: 'OK, go there now',
                            no: 'Cancel',
                            yesColor: 'primary'
                        }
                    }
                });

                modalInstance.result.then(function (yes) {
                    if (!yes) {
                        $location.url('/');
                        return;
                    }

                    $location.url('/employer/profile');
                }, function () {
                });
            }
        };

        $scope.isObjectValid = (inputObj) => {
            for (var property in inputObj) {
                if (inputObj.hasOwnProperty(property)) {
                    if (property !== 'isPremium') {
                        if (!inputObj[property]) {
                            return false;
                        }
                    }
                }
            }

            return true;
        };

        function handleLimit() {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                controller: 'ConfirmController',
                resolve: {
                    options: {
                        title: 'Please upgrade to Premium if you would like to post more than ' + $scope.freeLimit + ' job advertisements. Otherwise you should delete other ads.',
                        yes: 'Yes, go there now!',
                        yesColor: 'success',
                        no: 'No, continue with free',
                        noColor: 'primary'
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (!data) {
                    return;
                }

                $location.url('/employer/profile');
            }, function () {
            });
        }

        function completeJobPost() {
            if (!$scope.isObjectValid($scope.job)) {
                Notification.error({ title: 'Empty fields', message: '<i class="glyphicon glyphicon-remove"></i> Please fill out all fields before proceeding!', delay: 3000 });
                return;
            }

            var jobsService = new JobsService($scope.job);

            jobsService.$post(function (response) {
                $scope.creatingJobAd = false;
                Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> You have successfully created a job ad!', delay: 3000 });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Job creation failed for some reason!' });
            });
        }

        $scope.postJob = () => {
            if (!$scope.employer.premium) {
                $scope.jobs = JobsService.getJobsByUserId({}, { 'userId': $scope.employer._id }, function (response) {
                    $scope.jobs = response;
                    var isLimitHit = ($scope.jobs.length >= $scope.freeLimit);
                    if (isLimitHit) {
                        handleLimit();
                        return;
                    }

                    completeJobPost();
                }, function (response) {
                    Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
                });

            } else {
                completeJobPost();
            }
        };

        $scope.createInitialJobObject = () => {
            $scope.creatingJobAd = true;
            $scope.job = {
                type: "Full-time",
                category: "Software",
                level: "Specialist level",
                companyName: $scope.employer.employerMetadata.companyName,
                companyWebsite: $scope.employer.employerMetadata.companyWebsite,
                companyEmail: $scope.employer.email,
                companyPhone: $scope.employer.employerMetadata.companyPhone,
                requirements: null,
                responsibilities: null
            };

            $('#premium-toggle').change();
        };

        $scope.verifyEmployerProfileCompleted();
        $scope.createInitialJobObject();

        $('#premium-toggle').change(function () {
            $scope.job.isPremium = $(this).prop('checked')
        });

        if (!$scope.employer.premium) {
            $('#premium-toggle').bootstrapToggle('disable');
            $('#premium-toggle').prop('checked', false).change();
        } else {
            $('#premium-toggle').prop('checked', true).change();
        }
    }
}());
