'use strict';

/**
* Module dependencies
*/
var path = require('path'),
mongoose = require('mongoose'),
Job = mongoose.model('Job'),
JobApplication = mongoose.model('JobApplication'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const nodemailer = require('nodemailer');

/**
* Create an article
*/
exports.create = function (req, res) {
    var job = new Job(req.body);
    job.user = req.user;

    job.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(job);
        }
    });
};

exports.getJobsByUserId = function (req, res) {
    var userId = req.body.userId;
    Job.find({ 'user': userId }).populate('user').exec(function (err, jobs) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(jobs);
        }
    });
};

/**
* Show the current article
*/
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var job = req.job ? req.job.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    job.isCurrentUserOwner = !!(req.user && job.user && job.user._id.toString() === req.user._id.toString());

    res.json(job);
};

/**
* Update an article
*/
exports.update = function (req, res) {
    var job = req.body;

    Job.update({ _id: job._id }, job, function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(job);
        }
    });
};

/**
* Delete an article
*/
exports.delete = function (req, res) {
    var job = req.job;

    job.remove(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(job);
        }
    });
};

/**
* List of Articles
*/
exports.getAll = function (req, res) {
    Job.find().populate('user').sort('-created').exec(function (err, jobs) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(jobs);
        }
    });
};

/**
* Article middleware
*/
exports.jobByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Job is invalid'
        });
    }

    Job.findById(id).populate('user', 'displayName').exec(function (err, job) {
        if (err) {
            return next(err);
        } else if (!job) {
            return res.status(404).send({
                message: 'No article with that identifier has been found'
            });
        }
        req.job = job;
        next();
    });
};

exports.getAllApplications = function (req, res) {
    var userId = req.user._id;
    JobApplication.find({ 'user': userId }).exec(function (err, appl) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(appl);
        }
    });
};

exports.applyForJob = function (req, res) {
    var application = new JobApplication();
    application.job = req.body._id;
    application.user = req.user._id;
    application.save(function (err, appl) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            JobApplication.populate(appl, [{ path: "job" }, {path: "user"}], function (err, populatedAppl) {
                sendEmailToEmployer(populatedAppl.job, application.user, getProfileUrl(req, application.user._id));
                res.json(appl);
            });
        }
    });
};

function getProfileUrl(req, studentId) {
    return req.protocol + '://' + req.get('host') + '/student/profile/' + studentId;
}

function sendEmailToEmployer(job, applicant, profileUrl) {
    if (!process.env.NODEMAILER_PASS) {
        return;
    }

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "fdibacareercenter@gmail.com", // generated ethereal user
            pass: process.env.NODEMAILER_PASS  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"FCC Application Service" <fdibacareercenter@gmail.com>',
        to: job.companyEmail,
        cc: 'zlatkovtv@gmail.com',
        subject: 'Application for ' + job.title,
        html: '<p>' + applicant.displayName + ' has applied for this position ' + job.title + '.' + '</p><p>' +
        'Link to student profile: ' + profileUrl + '</p>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}
