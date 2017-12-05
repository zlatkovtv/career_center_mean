(function () {
    'use strict';

    angular
    .module('student')
    .controller('StudentReportsController', StudentReportsController);

    StudentReportsController.$inject = ['$scope', 'Authentication', 'FacultyService', 'Notification', '$sce'];

    function StudentReportsController($scope, Authentication, FacultyService, Notification, $sce) {
        $scope.generateTranscriptPdf = () => {
            $scope.report = {};
            $scope.report = FacultyService.generateTranscriptPdf(function (response) {
                var file = new Blob([response], { type: 'application/pdf' });
                var fileUrl = window.URL.createObjectURL(file);
                $scope.report = $sce.trustAsResourceUrl(fileUrl);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };
    }
}());
