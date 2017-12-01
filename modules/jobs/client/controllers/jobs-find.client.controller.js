(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsFindController', JobsFindController);

  JobsFindController.$inject = ['$scope', 'Authentication', 'JobsService'];

  function JobsFindController($scope, Authentication, JobsService) {
    $scope.authentication = Authentication;
    $scope.oneAtATime = true;

    $scope.$on('$viewContentLoaded', function () {
        $scope.jobs = JobsService.getJobs();
        console.log($scope.jobs);
    });

  }
}());
