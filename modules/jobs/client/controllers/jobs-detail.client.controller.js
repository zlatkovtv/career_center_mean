(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsDetailController', JobsDetailController);

  JobsDetailController.$inject = ['JobsService'];

  function JobsDetailController(JobsService) {
    var vm = this;

    vm.jobs = JobsService.query();
  }
}());
