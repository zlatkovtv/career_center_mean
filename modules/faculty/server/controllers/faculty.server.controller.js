'use strict';

/**
* Module dependencies
*/
var path = require('path'),
_ = require('lodash'),
fs = require('fs'),
mongoose = require('mongoose'),
FacultyClass = mongoose.model('FacultyClass'),
ClassEnrolment = mongoose.model('ClassEnrolment'),
Transcript = mongoose.model('Transcript'),
User = mongoose.model('User'),
PDFDocument = require('pdfkit'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
* Create an article
*/
exports.createClass = function (req, res) {
    var facultyClass = new FacultyClass(req.body);
    facultyClass._creatorId = req.user._id;

    facultyClass.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(facultyClass);
        }
    });
};

exports.addUserToClass = function (req, res) {
    var user = new User(req.body);
    var classId = req.params.classId;

    var enrolmentEntry = new ClassEnrolment();
    enrolmentEntry._classId = classId;
    enrolmentEntry._studentId = user._id;

    enrolmentEntry.save(function (err, enrolment) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(enrolment);
        }
    });
};

exports.getClassesForUser = function (req, res) {
    var user = req.user;

    FacultyClass.find({ '_creatorId': user._id }).exec(function (err, classes) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(classes);
        }
    });
};

exports.deleteClass = function (req, res) {
    FacultyClass.findByIdAndRemove(req.params.classId).exec(function (err, classes) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(classes);
        }
    });
};

exports.getEnrolments = function (req, res) {
    var classId = req.params.classId;

    ClassEnrolment.find({ '_classId': classId }).exec(function (err, enrolments) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(enrolments);
        }
    });
};

exports.saveStudentTranscript = function (req, res) {
    var transcript = new Transcript(req.body);

    transcript.save(function (err, tr) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(tr);
        }
    });
};

exports.generatePdfReportForStudent = function (req, res) {
    var studentId = req.user._id;
    Transcript.find().populate({
        path: '_enrolmentId',
        populate: {
            path: '_classId'
        }
    }).exec(function (err, mongoRes) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        mongoRes = mongoRes.filter(function (obj) {
            return obj._enrolmentId._studentId.equals(studentId);
        });

        generatePdfTranscript(mongoRes, req, res);
    });
};

function generatePdfTranscript(mongoRes, req, res) {
    var pdf = new PDFDocument({
        size: 'A4',
        info: {
            Title: 'FDIBA Official Transcripts for ' + req.user.displayName
        }
    });

    pdf.pipe(res);

    pdf.image('./modules/core/client/img/brand/tu-brand.png', {
        align: 'center'
    });

    pdf.fontSize(22).text('FDIBA Official Transcript ' + new Date().getFullYear(), {
        align: 'center'
    }).moveDown(5);

    var index = 1;

    _.forEach(mongoRes, function (value) {
        pdf.fontSize(16).text(
            index + '. ' + value._enrolmentId._classId.department + '/' +
            value._enrolmentId._classId.subjectName + ' - ' + value.grade
        );
        index++;
    });

    pdf.end();
}
