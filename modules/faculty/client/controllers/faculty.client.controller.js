(function () {
  'use strict';

  angular
    .module('faculty')
    .controller('FacultyController', FacultyController);

  FacultyController.$inject = ['$scope', '$state', 'Authentication', '$uibModal', 'FacultyService', 'Notification'];

  function FacultyController($scope, $state, Authentication, $uibModal, FacultyService, Notification) {
      $scope.classes = [];
      $scope.getClassesForUser = () => {
          $scope.classes = FacultyService.getClassesForUser(function (response) {
              $scope.classes = response;
              console.log($scope.classes);
          }, function (response) {
              Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
          });
      };

      $scope.launchClassCreateWizard = () => {
          var modalInstance = $uibModal.open({
              templateUrl: '/modules/templates/client/views/create-class.client.modal.html',
              controller: 'CreateClassController'
          });

          modalInstance.result.then(function (result) {
              if (!result) {
                  return;
              }

              $scope.getClassesForUser();
          }, function () {
          });
      };

      $scope.deleteClass = (facultyClass) => {
          var modalInstance = $uibModal.open({
              templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
              controller: 'ConfirmController',
              resolve: {
                  options: {
                      title: 'Are you sure you want to delete this class?',
                      yes: 'Delete',
                      no: 'Cancel',
                      yesColor: 'danger',
                      noColor: 'primary'
                  }
              }
          });

          modalInstance.result.then(function (result) {
              if (!result) {
                  return;
              }

              $scope.classes = FacultyService.deleteClass({ classId: facultyClass._id }, {}, function (response) {
                  $scope.getClassesForUser();
                  Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i> Success', message: 'Class deleted!' });
              }, function (response) {
                  Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not delete class for some reason!' });
              });
          }, function () {
          });
      };

      $scope.addStudentToClass = (facultyClass) => {
          var modalInstance = $uibModal.open({
              templateUrl: '/modules/templates/client/views/enrolment.client.modal.html',
              controller: 'EnrolmentController',
              resolve: {
                  facultyClass: facultyClass
              }
          });

          modalInstance.result.then(function (result) {
              if (!result) {
                  return;
              }

          }, function () {
          });
      };

      $scope.getClassesForUser();
  }
}());
