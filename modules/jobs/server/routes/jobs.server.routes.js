'use strict';

/**
* Module dependencies
*/
var jobsPolicy = require('../policies/jobs.server.policy'),
jobs = require('../controllers/jobs.server.controller');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/jobs/create')
    .post(jobs.create);

    app.route('/api/jobs/update')
    .put(jobs.update);

    app.route('/api/jobs/all')
    .get(jobs.getAll);

    app.route('/api/jobs/getJobsByUserId')
    .post(jobs.getJobsByUserId);

    app.route('/api/jobs/applications')
    .get(jobs.getAllApplications)
    .post(jobs.applyForJob);

    // Single article routes
    app.route('/api/jobs/:jobId')
    .get(jobs.read)
    .put(jobs.update)
    .delete(jobs.delete);

    // Finish by binding the article middleware
    app.param('jobId', jobs.jobByID);
};
