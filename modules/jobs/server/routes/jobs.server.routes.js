'use strict';

/**
* Module dependencies
*/
var jobsPolicy = require('../policies/jobs.server.policy'),
jobs = require('../controllers/jobs.server.controller');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/jobs/create').all(jobsPolicy.isAllowed)
    .post(jobs.create);

    app.route('/api/jobs/update').all(jobsPolicy.isAllowed)
    .put(jobs.update);

    // Single article routes
    app.route('/api/jobs/:jobId').all(jobsPolicy.isAllowed)
    .get(jobs.read)
    .put(jobs.update)
    .delete(jobs.delete);

    // Finish by binding the article middleware
    app.param('jobId', jobs.jobByID);
};
