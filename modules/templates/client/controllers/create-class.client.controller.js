(function () {
    'use strict';

    angular
    .module('templates')
    .controller('CreateClassController', CreateClassController);

    CreateClassController.$inject = ['$scope', '$uibModalInstance', 'FacultyService'];

    function CreateClassController($scope, $uibModalInstance, FacultyService) {
        $scope.createClass = () => {
            $scope.jobs = FacultyService.createClass({}, {}, function (response) {
                $uibModalInstance.close();
                Notification.error({ message: 'Success', title: '<i class="glyphicon glyphicon-ok"></i> Class successfully created!' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
            });
        };

        $scope.close = () => {
            $uibModalInstance.close();
        };
    }
}());
