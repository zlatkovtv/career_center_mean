'use strict';

/**
* Module dependencies
*/
var path = require('path'),
mongoose = require('mongoose'),
Class = mongoose.model('Class'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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
