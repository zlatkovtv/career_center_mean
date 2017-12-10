(function () {
    'use strict';

    angular
    .module('jobs')
    .controller('JobsCreateController', JobsCreateController);

    JobsCreateController.$inject = ['$scope', 'JobsService', 'Notification', 'Authentication', '$uibModal', '$location'];

    function JobsCreateController($scope, JobsService, Notification, Authentication, $uibModal, $location) {
        $scope.employer = Authentication.user;
        $scope.canEditCompanyFields = false;
        $scope.job = {
            type: "Full-time",
            category: "IT",
            level: "Specialist level",
            companyName: $scope.employer.employerMetadata.companyName,
            companyWebsite: $scope.employer.employerMetadata.companyWebsite,
            companyEmail: $scope.employer.email,
            companyPhone: $scope.employer.employerMetadata.companyPhone,
            requirements: null,
            responsibilities: null
        };
        $scope.jobTypes =
        {
            'fulltime': 'Full-time',
            'parttime': 'Part-time',
            'internship': 'Internship'
        };
        $scope.jobCategories =
        {
            "business": "Business",
            "it": "IT",
            "tourism": "Travel and tourism",
            "hr": "Human resources",
            "cooking": "Cooking",
            "delivery": "Delivery",
            "architecture": "Architecture",
            "design": "Design/Creative/Animation",
            "education": "Teacher/professor/educator",
            "production": "Production",
            "media": "Media/news",
            "financial": "Financial",
            "law": "Law"
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
                    if (!inputObj[property]) {
                        return false;
                    }
                }
            }

            return true;
        };

        $scope.postJob = () => {
            if (!$scope.isObjectValid($scope.job)) {
                Notification.error({ title: 'Empty fields', message: '<i class="glyphicon glyphicon-remove"></i> Please fill out all fields before proceeding!', delay: 3000 });
                return;
            }
            var jobsService = new JobsService($scope.job);

            jobsService.$post(function (response) {
                Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> You have successfully created a job ad!', delay: 3000 });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Job creation failed for some reason!' });
            });

        };

        $scope.verifyEmployerProfileCompleted();
    }
}());
