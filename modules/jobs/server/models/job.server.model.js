'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
path = require('path'),
config = require(path.resolve('./config/config')),
chalk = require('chalk');

/**
* Article Schema
*/
var JobSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Job title is required'
    },
    companyId: {
        type: String,
        default: '',
        trim: true
    },
    companyName: {
        type: String,
        default: '',
        trim: true,
        required: 'Company name is required'
    },
    companyWebsite: {
        type: String,
        default: '',
        trim: true,
        required: 'Company website is required'
    },
    companyEmail: {
        type: String,
        default: '',
        trim: true,
        required: 'Company email is required'
    },
    companyPhone: {
        type: String,
        default: '',
        trim: true,
        required: 'Company phone is required'
    },
    type: {
        type: String,
        default: '',
        trim: true,
        required: 'Job type is required'
    },
    category: {
        type: String,
        default: '',
        trim: true,
        required: 'Job category is required'
    },
    level: {
        type: String,
        default: '',
        trim: true,
        required: 'Job level is required'
    },
    requirements: {
        type: String,
        default: '',
        trim: true,
        required: 'Requirements are required'
    },
    description: {
        type: String,
        default: '',
        trim: true,
        required: 'Description is required'
    },
    responsibilities: {
        type: String,
        default: '',
        trim: true,
        required: 'Responsibilities are required'
    }
});

JobSchema.statics.seed = seed;

mongoose.model('Job', JobSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
    var Job = mongoose.model('Job');

    return new Promise(function (resolve, reject) {

        skipDocument()
        .then(findAdminUser)
        .then(add)
        .then(function (response) {
            return resolve(response);
        })
        .catch(function (err) {
            return reject(err);
        });

        function findAdminUser(skip) {
            var User = mongoose.model('User');

            return new Promise(function (resolve, reject) {
                if (skip) {
                    return resolve(true);
                }

                User
                .findOne({
                    roles: { $in: ['admin'] }
                })
                .exec(function (err, admin) {
                    if (err) {
                        return reject(err);
                    }

                    doc.user = admin;

                    return resolve();
                });
            });
        }

        function skipDocument() {
            return new Promise(function (resolve, reject) {
                Job
                .findOne({
                    title: doc.title
                })
                .exec(function (err, existing) {
                    if (err) {
                        return reject(err);
                    }

                    if (!existing) {
                        return resolve(false);
                    }

                    if (existing && !options.overwrite) {
                        return resolve(true);
                    }

                    // Remove Article (overwrite)

                    existing.remove(function (err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(false);
                    });
                });
            });
        }

        function add(skip) {
            return new Promise(function (resolve, reject) {
                if (skip) {
                    return resolve({
                        message: chalk.yellow('Database Seeding: Article\t' + doc.title + ' skipped')
                    });
                }

                var job = new Job(doc);

                job.save(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve({
                        message: 'Database Seeding: Article\t' + job.title + ' added'
                    });
                });
            });
        }
    });
}
