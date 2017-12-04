'use strict';

/**
* Module dependencies
*/
var facultyController = require('../controllers/faculty.server.controller');

module.exports = function (app) {
    app.route('/api/faculty/class/all')
    .get(facultyController.getClassesForUser);

    app.route('/api/faculty/class')
    .post(facultyController.createClass);

    app.route('/api/faculty/class/:classId')
    .get(facultyController.getEnrolments)
    .post(facultyController.addUserToClass)
    .delete(facultyController.deleteClass);

    // app.param('jobId', facultyController.jobByID);
};
