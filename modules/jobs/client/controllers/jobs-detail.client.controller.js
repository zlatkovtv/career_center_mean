(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsDetailController', JobsDetailController);

  JobsDetailController.$inject = ['$scope', 'JobsService', 'job', '$uibModalInstance'];

  function JobsDetailController($scope, JobsService, job, $uibModalInstance) {
    $scope.job = job;

    $scope.closeJobDetailModal = () => {
        $uibModalInstance.close();
    };

    $scope.apply = () => {
    };
  }
}());
