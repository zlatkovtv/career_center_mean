(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsFindController', JobsFindController);

  JobsFindController.$inject = ['$scope', 'Authentication'];

  function JobsFindController($scope, Authentication) {
    var vm = this;

    // vm.job = jobsResolve;
    vm.authentication = Authentication;

  }
}());
