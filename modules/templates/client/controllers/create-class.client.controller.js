(function () {
    'use strict';

    angular
    .module('templates')
    .controller('CreateClassController', CreateClassController);

    CreateClassController.$inject = ['$scope', '$uibModalInstance', 'FacultyService', 'Notification'];

    function CreateClassController($scope, $uibModalInstance, FacultyService, Notification) {
        $scope.class = {};
        $scope.createClass = () => {
            $scope.jobs = FacultyService.createClass({}, $scope.class, function (response) {
                $uibModalInstance.close(response);
                Notification.success({ message: 'Success', title: '<i class="glyphicon glyphicon-ok"></i> Class successfully created!' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
            });
        };

        $scope.close = () => {
            $uibModalInstance.close();
        };
    }
}());
