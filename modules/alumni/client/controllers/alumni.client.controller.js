(function () {
  'use strict';

  angular
    .module('alumni')
    .controller('AlumniController', AlumniController);

  AlumniController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function AlumniController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
  }
}());
