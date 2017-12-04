(function () {
    'use strict';

    angular
    .module('jobs')
    .controller('JobsFindController', JobsFindController);

    JobsFindController.$inject = ['$scope', 'Authentication', 'JobsService', '$uibModal'];

    function JobsFindController($scope, Authentication, JobsService, $uibModal) {
        $scope.jobs = [];
        $scope.applicationsForUser = [];
        $scope.authentication = Authentication;
        $scope.oneAtATime = true;

        $scope.$on('$viewContentLoaded', function () {
            $scope.jobs = JobsService.getJobs();

            $scope.applicationsForUser = JobsService.getAllApplications({ jobId: Authentication.user._id }, {}, function (response) {
                Notification.success({ message: 'Could not retrieve classes for some reason!', title: '<i class="glyphicon glyphicon-remove"></i> Success' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        });

        $scope.popJobDetail = (job) => {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/jobs/client/views/jobs-detail.client.view.html',
                controller: 'JobsDetailController',
                resolve: {
                    job: function () {
                        return job;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };

        $scope.applyForJob = (job) => {
            JobsService.applyForJob({ jobId: job._id }, {}, function (response) {
                Notification.success({ message: 'Could not retrieve classes for some reason!', title: '<i class="glyphicon glyphicon-remove"></i> Success' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };
    }
}());
