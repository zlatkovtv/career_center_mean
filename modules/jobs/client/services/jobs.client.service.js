(function () {
    'use strict';

    angular
    .module('jobs.services')
    .factory('JobsService', JobsService);

    JobsService.$inject = ['$resource', '$log'];

    function JobsService($resource, $log) {
        var Job = $resource('/api/jobs/:jobId',
        {
            jobId: '@_jobId'
        },
        {
            getJobs: {
                method: 'GET',
                url: '/api/jobs/all',
                isArray: true
            },
            getJobsByUserId: {
                method: 'POST',
                url: '/api/jobs/getJobsByUserId',
                isArray: true,
                hasBody: true
            },
            updateJob: {
                method: 'PUT',
                url: '/api/jobs/update'
            },
            post: {
                method: 'POST',
                url: '/api/jobs/create'
            },
            applyForJob: {
                method: 'POST',
                url: '/api/jobs/applications/'
            },
            getAllApplications: {
                method: 'GET',
                url: '/api/jobs/applications/',
                isArray: true
            }
        });

        return Job;
    }
}());
