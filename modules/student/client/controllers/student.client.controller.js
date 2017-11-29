(function () {
  'use strict';

  angular
  .module('student')
  .controller('StudentController', StudentController);

  StudentController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function StudentController($scope, $state, Authentication, Socket) {
    $scope.progressLabel = "Profile information";
    $scope.progressPercent = 20;
    $scope.showAlert = true;
    $scope.user = Authentication.user;
    console.log($scope.user);

    $scope.closeWizardAlert = () => {
      return "";
    };

    $scope.closeWizardAlert = () => {
      $scope.showAlert = false;
    };
  }
}());
