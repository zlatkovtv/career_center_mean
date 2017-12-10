(function () {
  'use strict';

  angular
    .module('employer')
    .controller('EmployerProfileController', EmployerProfileController);

  EmployerProfileController.$inject = ['$scope', 'Notification', 'UsersService', 'Authentication'];

  function EmployerProfileController($scope, Notification, UsersService, Authentication) {
      $scope.user = Authentication.user;
      console.log($scope.user);

      $scope.validateCurrentForm = () => {
          if (!$scope.user.employerMetadata.companyName || !$scope.user.employerMetadata.companyWebsite || !$scope.user.employerMetadata.companyPhone) {
              $scope.isSaveEnabled = false;
              return;
          }

          $scope.isSaveEnabled = true;
      };

      $scope.save = () => {
          var usersService = new UsersService($scope.user);
          usersService.$update(function (response) {
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Employer profile successfully updated!', delay: 3000 });
              Authentication.user = response;
          }, function (response) {
              Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!', delay: 3000 });
          });
      };

      $scope.validateCurrentForm();
  }
}());
