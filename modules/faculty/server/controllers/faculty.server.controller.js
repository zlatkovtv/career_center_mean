'use strict';

/**
* Module dependencies
*/
var path = require('path'),
mongoose = require('mongoose'),
FacultyClass = mongoose.model('FacultyClass'),
ClassEnrolment = mongoose.model('ClassEnrolment'),
User = mongoose.model('User'),
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
