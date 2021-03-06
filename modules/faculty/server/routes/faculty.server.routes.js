'use strict';

/**
* Module dependencies
*/
var facultyController = require('../controllers/faculty.server.controller');

module.exports = function (app) {
    app.route('/api/faculty/class/all')
    .get(facultyController.getClassesForUser);

    app.route('/api/faculty/class')
    .get(facultyController.getEnrolments)
    .post(facultyController.createClass);

    app.route('/api/faculty/class/:classId')
    .get(facultyController.getEnrolmentsByClassId)
    .post(facultyController.addUserToClass)
    .delete(facultyController.deleteClass);

    app.route('/api/faculty/transcript/')
    .get(facultyController.getStudentTranscripts)
    .post(facultyController.saveStudentTranscript);

    app.route('/api/faculty/transcript/:enrolmentId')
    .get(facultyController.getStudentTranscriptByEnrolmentId)

    app.route('/api/faculty/transcript/:studentId')
    .post(facultyController.getStudentTranscriptsByStudentId)

    app.route('/api/faculty/report')
    .post(facultyController.generatePdfReportForStudent)
    .put(facultyController.generateAllPdfReportForStudent);

    // app.param('jobId', facultyController.jobByID);
};
