(function () {
    'use strict';

    angular
    .module('templates')
    .controller('ConfirmController', ConfirmController);

    ConfirmController.$inject = ['$scope', 'options', '$uibModalInstance'];

    function ConfirmController($scope, options, $uibModalInstance) {
        $scope.options = options;

        $scope.close = (data) => {
            $uibModalInstance.close(data);
        };
    }
}());
