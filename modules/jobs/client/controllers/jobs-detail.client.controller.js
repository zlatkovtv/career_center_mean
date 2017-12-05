(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsDetailController', JobsDetailController);

  JobsDetailController.$inject = ['$scope', 'JobsService', 'data', '$uibModalInstance', 'Notification'];

  function JobsDetailController($scope, JobsService, data, $uibModalInstance, Notification) {
    $scope.job = data.job;
    $scope.hasUserApplied = data.hasUserApplied;

    $scope.closeJobDetailModal = () => {
        $uibModalInstance.close();
    };

    $scope.applyForJob = () => {
        JobsService.applyForJob({}, $scope.job, function (response) {
            $scope.hasUserApplied = true;
            $uibModalInstance.close($scope.hasUserApplied);
            Notification.success({ message: 'You have applied for this position! Please check your inbox email regularly.', title: '<i class="glyphicon glyphicon-ok"></i> Success' });
        }, function (response) {
            Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
        });
    };
  }
}());
