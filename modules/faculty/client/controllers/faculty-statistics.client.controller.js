(function () {
    'use strict';

    angular
        .module('faculty')
        .controller('FacultyStatisticsController', FacultyStatisticsController);

    FacultyStatisticsController.$inject = ['$scope', '$state', 'Authentication', '$uibModal', 'UsersService', 'FacultyService', 'Notification'];

    function FacultyStatisticsController($scope, $state, Authentication, $uibModal, UsersService, FacultyService,  Notification) {
        $scope.getAllStudents = () => {
            $scope.allStudents = UsersService.getAllStudents(function (response) {
                $scope.allStudents = response;
                $scope.initiateStudentChart();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve classes for some reason!' });
            });

            $scope.enrolments = FacultyService.getEnrolments({}, {}, function (response) {
                $scope.enrolments = response;
                $scope.initiateEnrollmentChart();
            }, function (response) {
                Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Could not retrieve enrollments for some reason!' });
            });
        };

        $scope.initiateEnrollmentChart = function () {
            var enrollmentData = {};

            var count = 1;
            $scope.enrolments.forEach(enr => {
                var subjectName = enr.class.subjectName;
                if(!enrollmentData[subjectName]) {
                    count = 1;
                } else {
                    count++;
                }

                enrollmentData[subjectName] = count;
            });

            var ctx = document.getElementById("enrollment-chart").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(enrollmentData),
                    datasets: [{
                        label: 'Students enrolled',
                        data: Object.values(enrollmentData),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Distribution of students in classes'
                    }
                }
            });
        }

        $scope.initiateStudentChart = function () {
            var skillData = {};

            var count = 1;
            $scope.allStudents.forEach(student => {
                var techSkills = student.studentMetadata.techSkills;
                var softSkills = student.studentMetadata.softSkills;
                var allSkills = techSkills.concat(softSkills);

                allSkills.forEach(skill => {
                    if(!skillData[skill]) {
                        count = 1;
                    } else {
                        count++;
                    }
    
                    skillData[skill] = count;
                });
            });

            var ctx = document.getElementById("student-chart").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: Object.keys(skillData),
                    datasets: [{
                        label: 'Number of students',
                        data: Object.values(skillData),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
                        ]
                    }]
                },
                options: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Top skills of students'
                    },
                    scales: {
                       
                        xAxes: [{
                          ticks: {
                            beginAtZero: true
                          }
                        }]
                    }
                }
            });
        }

        $scope.getAllStudents();
    }
}());
