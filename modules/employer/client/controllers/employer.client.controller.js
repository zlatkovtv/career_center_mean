(function () {
  'use strict';

  angular
    .module('employer')
    .controller('EmployerController', EmployerController);

  EmployerController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function EmployerController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
  }
}());
