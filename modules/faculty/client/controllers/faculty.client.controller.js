(function () {
  'use strict';

  angular
    .module('faculty')
    .controller('FacultyController', FacultyController);

  FacultyController.$inject = ['$scope', '$state', 'Authentication', '$uibModal'];

  function FacultyController($scope, $state, Authentication, $uibModal) {
      $scope.classes = [];

      $scope.launchClassCreateWizard = () => {
          var modalInstance = $uibModal.open({
              templateUrl: '/modules/templates/client/views/create-class.client.modal.html',
              controller: 'CreateClassController'
          });

          modalInstance.result.then(function () {
          }, function () {
          });
      };
  }
}());
