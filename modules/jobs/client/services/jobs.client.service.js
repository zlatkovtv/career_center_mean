(function () {
    'use strict';

    angular
    .module('jobs.services')
    .factory('JobsService', JobsService);

    JobsService.$inject = ['$resource', '$log'];

    function JobsService($resource, $log) {
        var Job = $resource('/api/jobs/:jobId',
        {
            jobId: '@_id'
        },
        {
            updateJob: {
                method: 'PUT',
                url: '/api/jobs/update'
            },
            createJob: {
                method: 'POST',
                url: '/api/jobs/create'
            }
        });

        angular.extend(Job, {
            createOrUpdate: function () {
                var job = this;
                return createOrUpdate(job);
            }
        });

        return Job;

        function createOrUpdate(job) {
            if (job._id) {
                return job.updateJob(onSuccess, onError);
            } else {
                return job.createJob(onSuccess, onError);
            }

            // Handle successful response
            function onSuccess(job) {
                // Any required internal processing from inside the service, goes here.
            }

            // Handle error response
            function onError(errorResponse) {
                var error = errorResponse.data;
                // Handle error internally
                handleError(error);
            }
        }

        function handleError(error) {
            // Log error
            $log.error(error);
        }
    }
}());
