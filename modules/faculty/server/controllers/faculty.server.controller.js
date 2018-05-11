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
    facultyClass.creator = req.user._id;

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
    enrolmentEntry.class = classId;
    enrolmentEntry.student = user._id;

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

    FacultyClass.find({ 'creator': user._id }).exec(function (err, classes) {
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

    ClassEnrolment.find({ 'class': classId }).exec(function (err, enrolments) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(enrolments);
        }
    });
};

exports.getStudentTranscriptsByStudentId = function (req, res) {
    var studentId = req.params.studentId;

    Transcript.find({})
        .populate({
            path: 'enrolment',
            model: 'ClassEnrolment',
            populate: {
                path: 'class',
                model: 'FacultyClass',
            }
        })
        .exec(function (err, transcripts) {
            if (err) {
                return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                transcripts = transcripts.filter(function (doc) {
                    return doc.enrolment.student.equals(new mongoose.Types.ObjectId(studentId));
                });

                res.json(transcripts);
            }
        });
};

exports.getStudentTranscriptByEnrolmentId = function (req, res) {
    var enrolmentId = req.params.enrolmentId;

    Transcript.findOne({ 'enrolment': enrolmentId }).exec(function (err, transcript) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(transcript);
        }
    });

};

exports.saveStudentTranscript = function (req, res) {
    var transcript = new Transcript(req.body);
    Transcript.update({ enrolment: transcript.enrolment }, req.body, { upsert: true }, function (err, tr) {
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
        path: 'enrolment',
        populate: {
            path: 'class'
        }
    }).exec(function (err, mongoRes) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        mongoRes = mongoRes.filter(function (obj) {
            return obj.enrolment.student.equals(studentId);
        });

        if (!mongoRes || mongoRes.length === 0) {
            res.status(204);
        }

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
            index + '. ' + value.enrolment.class.department + '/' +
            value.enrolment.class.subjectName + ' - ' + value.grade
        );
        index++;
    });

    pdf.end();
}
