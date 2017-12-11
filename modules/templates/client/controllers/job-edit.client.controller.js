(function () {
    'use strict';

    angular
    .module('templates')
    .controller('JobEditController', JobEditController);

    JobEditController.$inject = ['$scope', 'job', '$uibModalInstance', 'JobsService', 'Notification'];

    function JobEditController($scope, job, $uibModalInstance, JobsService, Notification) {
        $scope.job = job;
        $scope.canEditCompanyFields = false;
        $scope.jobTypes =
        {
            'fulltime': 'Full-time',
            'parttime': 'Part-time',
            'internship': 'Internship'
        };
        $scope.jobCategories =
        {
            "business": "Business",
            "it": "IT",
            "tourism": "Travel and tourism",
            "hr": "Human resources",
            "cooking": "Cooking",
            "delivery": "Delivery",
            "architecture": "Architecture",
            "design": "Design/Creative/Animation",
            "education": "Teacher/professor/educator",
            "production": "Production",
            "media": "Media/news",
            "financial": "Financial",
            "law": "Law"
        };
        $scope.jobLevels =
        {
            'management': 'Management level',
            'specialist': 'Specialist level',
            'worker': 'Worker level'
        };

        $scope.close = (data) => {
            $uibModalInstance.close(data);
        };

        $scope.update = () => {
            $scope.classes = JobsService.updateJob({}, $scope.job, function (response) {
                $scope.job = response;
                Notification.success({ title: '<i class="glyphicon glyphicon-ok"></i> Success', message: 'Job ad successfully updated!' });
                $uibModalInstance.close();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not update job ad for some reason!' });
            });
        };
    }
}());
