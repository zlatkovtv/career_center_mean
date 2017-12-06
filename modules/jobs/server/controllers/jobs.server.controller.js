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
    var companyName = req.body.companyName;
    Job.find({ 'companyName': companyName }).exec(function (err, jobs) {
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
    var job = req.job;

    job.title = req.body.title;
    job.content = req.body.content;

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
    Job.find().sort('-created').exec(function (err, jobs) {
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
    JobApplication.find({ '_userId': userId }).exec(function (err, appl) {
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
    application._jobId = req.body._id;
    application._userId = req.user._id;
    application.save.populate('_jobId').exec(function (err, appl) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var companyEmail = appl._jobId.companyEmail;
            sendEmailToEmployer(companyEmail);
            res.json(appl);
        }
    });
};

function sendEmailToEmployer(companyEmail) {
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
        from: '"FDIBA Career Center 👻" <fdibacareercenter@gmail.com>', // sender address
        to: companyEmail, // list of receivers
        subject: 'Job application', // Subject line
        text: 'A candidate has applied for this position'
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
