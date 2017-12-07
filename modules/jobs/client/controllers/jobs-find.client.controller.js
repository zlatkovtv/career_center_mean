(function () {
    'use strict';

    angular
    .module('jobs')
    .controller('JobsFindController', JobsFindController);

    JobsFindController.$inject = ['$scope', 'Authentication', 'JobsService', '$uibModal', 'Notification'];

    function JobsFindController($scope, Authentication, JobsService, $uibModal, Notification) {
        $scope.jobs = [];
        $scope.applicationsForUser = [];
        $scope.applicationJobIds = [];
        $scope.authentication = Authentication;
        $scope.oneAtATime = true;

        $scope.getApplications = () => {
            $scope.applicationsForUser = JobsService.getAllApplications(function (response) {
                $scope.applicationsForUser = response;
                $scope.applicationJobIds = response.map(appl => appl.job);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.popJobDetail = (job) => {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/jobs/client/views/jobs-detail.client.view.html',
                controller: 'JobsDetailController',
                resolve: {
                    data: {
                        job: job,
                        hasUserApplied: $scope.hasUserAppliedForJob(job)
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    $scope.getApplications();
                }
            }, function () {
            });
        };

        $scope.applyForJob = (job) => {
            JobsService.applyForJob({}, job, function (response) {
                $scope.getApplications();
                Notification.success({ message: 'You have applied for this position! Please check your inbox email regularly.', title: '<i class="glyphicon glyphicon-ok"></i> Success' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.hasUserAppliedForJob = (job) => {
            if ($scope.applicationJobIds.indexOf(job._id) !== -1) {
                return true;
            }

            return false;
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.jobs = JobsService.getJobs();
            $scope.getApplications();
        });
    }
}());
