var myApp = angular.module('jobs');
(function (app) {
    app.controller('JobsFindController', function ($scope, Authentication, JobsService, $uibModal, Notification, $location) {
        $scope.jobs = [];
        $scope.applicationsForUser = [];
        $scope.applicationJobIds = [];
        $scope.user = Authentication.user;
        $scope.oneAtATime = true;

        if ($scope.user.roles.indexOf('student') !== -1 && !$scope.user.studentMetadata.isPersonalProfileCompleted) {
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
                controller: 'ConfirmController',
                resolve: {
                    options: {
                        title: 'You need to complete your student profile before you can apply for jobs.',
                        yes: 'OK, go there now',
                        no: 'Cancel',
                        yesColor: 'primary'
                    }
                }
            });

            modalInstance.result.then(function (yes) {
                if (!yes) {
                    $location.url('/');
                    return;
                }

                $location.url('/student/profile');
            }, function () {
            });
        }

        $scope.getApplications = () => {
            $scope.applicationsForUser = JobsService.getAllApplications(function (response) {
                $scope.applicationsForUser = response;
                $scope.applicationJobIds = response.map(appl => appl.job);
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.popJobDetail = (job) => {
            console.log(job);
            var modalInstance = $uibModal.open({
                templateUrl: '/modules/jobs/client/views/jobs-detail.client.view.html',
                controller: 'JobsDetailController',
                resolve: {
                    data: {
                        job: job,
                        hasUserApplied: $scope.hasUserAppliedForJob(job)
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    $scope.getApplications();
                }
            }, function () {
            });
        };

        $scope.applyForJob = (job) => {
            JobsService.applyForJob({}, job, function (response) {
                $scope.getApplications();
                Notification.success({ message: 'You have applied for this position! Please check your inbox email regularly.', title: '<i class="glyphicon glyphicon-ok"></i> Success' });
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });
        };

        $scope.hasUserAppliedForJob = (job) => {
            if ($scope.applicationJobIds.indexOf(job._id) !== -1) {
                return true;
            }

            return false;
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.jobs = JobsService.getJobs();
            console.log($scope.jobs);
            $scope.getApplications();
        });

        function replaceAll(target, search, replacement) {
            return target.split(search).join(replacement);
        }

        $scope.setCompanyImage = function (imageUrl) {
            if (!imageUrl) {
                imageUrl = "/modules/core/client/img/brand/placeholder.png";
            }

            var root = $location.protocol() + "://" + $location.host() + ":" + $location.port();
            return root + replaceAll(imageUrl, "\\", '\/');
        };
    });
})(myApp);
