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
var JobApplicationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    _jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    _userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('JobApplication', JobApplicationSchema);

function seed(doc, options) {
    var JobApplication = mongoose.model('JobApplication');

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
                JobApplication
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

                var jobApplication = new JobApplication(doc);

                jobApplication.save(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve({
                        message: 'Database Seeding: Article\t' + jobApplication.title + ' added'
                    });
                });
            });
        }
    });
}
