(function () {
    'use strict';

    angular
    .module('jobs')
    .controller('JobsCreateController', JobsCreateController);

    JobsCreateController.$inject = ['$scope', 'JobsService', 'Notification'];

    function JobsCreateController($scope, JobsService, Notification) {
        $scope.job = {
            type: "Full-time",
            category: "IT",
            level: "Specialist level",
            companyName: null,
            companyWebsite: null,
            companyEmail: null,
            companyPhone: null,
            requirements: null,
            responsibilities: null
        };
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

        $scope.isObjectValid = (inputObj) => {
            for (var property in inputObj) {
                if (inputObj.hasOwnProperty(property)) {
                    if (!inputObj[property]) {
                        return false;
                    }
                }
            }

            return true;
        };

        $scope.postJob = () => {
            if (!$scope.isObjectValid($scope.job)) {
                Notification.error({ title: 'Empty fields', message: '<i class="glyphicon glyphicon-remove"></i> Please fill out all fields before proceeding!', delay: 3000 });
                return;
            }

            console.log(JobsService);
            JobsService.post($scope.job);

        };
    }
}());
