(function () {
    'use strict';

    angular
    .module('templates')
    .controller('TranscriptInputController', TranscriptInputController);

    TranscriptInputController.$inject = ['$scope', '$uibModalInstance', 'grade'];

    function TranscriptInputController($scope, $uibModalInstance, grade) {
        $scope.grade = grade;

        $scope.closeTranscriptModal = () => {
            $uibModalInstance.close($scope.grade);
        };

        $scope.validateGrade = () => {
            if ($scope.grade < 2) {
                $scope.grade = 2;
            } else if ($scope.grade > 6) {
                $scope.grade = 6;
            }
        };
    }
}());
