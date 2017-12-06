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
                var file = new Blob([response.data], { type: 'application/pdf' });
                var fileUrl = window.URL.createObjectURL(file);
                $scope.report = $sce.trustAsResourceUrl(fileUrl);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileUrl;
                a.download = "official_transcript.pdf";
                a.click();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };
    }
}());
