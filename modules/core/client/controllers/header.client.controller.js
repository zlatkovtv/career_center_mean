(function () {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function HeaderController($scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.inboxMenu = menuService.getMenu('inbox');
    console.log(vm.authentication);
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
