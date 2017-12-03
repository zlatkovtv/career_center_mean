(function () {
    'use strict';

    angular
    .module('jobs')
    .controller('JobsFindController', JobsFindController);

    JobsFindController.$inject = ['$scope', 'Authentication', 'JobsService', '$uibModal'];

    function JobsFindController($scope, Authentication, JobsService, $uibModal) {
        $scope.authentication = Authentication;
        $scope.oneAtATime = true;

        $scope.$on('$viewContentLoaded', function () {
            $scope.jobs = JobsService.getJobs();
            console.log($scope.jobs);
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
    }
}());
