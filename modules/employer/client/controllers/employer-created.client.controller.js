(function () {
    'use strict';

    angular
    .module('employer')
    .controller('EmployerCreatedController', EmployerCreatedController);

    EmployerCreatedController.$inject = ['$scope', '$state', 'Authentication', 'JobsService', '$uibModal', '$location', 'Notification'];

    function EmployerCreatedController($scope, $state, Authentication, JobsService, $uibModal, $location, Notification) {
        $scope.user = Authentication.user;

        $scope.deleteJob = (job) => {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                controller: 'ConfirmController',
                resolve: {
                    options: {
                        title: 'Are you sure you want to delete this ad?',
                        yes: 'Delete',
                        no: 'Cancel',
                        yesColor: 'danger',
                        noColor: 'primary'
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (!result) {
                    return;
                }

                $scope.jobs = JobsService.delete({ jobId: job._id }, {}, function (response) {
                    $scope.getJobs();
                    Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i> Success', message: ' Job ad successfully deleted!' });
                }, function (response) {
                    Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
                });
            }, function () {
            });
        };

        $scope.editJob = (job) => {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/templates/client/views/jobs-edit.client.modal.html',
                controller: 'JobEditController',
                resolve: {
                    job: function () {
                        return job;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        $scope.goToCreateJobsPage = () => {
            $location.url('/jobs/create');
        };

        $scope.getJobs = () => {
            $scope.jobs = JobsService.getJobsByUserId({}, { 'userId': $scope.user._id }, function (response) {
                $scope.jobs = response;
                console.log($scope.jobs);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
            });
        };

        $scope.getJobs();
    }
}());
