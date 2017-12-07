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
var FacultyClassSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    subjectName: {
        type: String,
        default: null,
        trim: true,
        required: 'Subject name is required'
    },
    department: {
        type: String,
        default: null,
        trim: true,
        required: 'Department is required'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

FacultyClassSchema.statics.seed = seed;

mongoose.model('FacultyClass', FacultyClassSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
    var FacultyClass = mongoose.model('FacultyClass');

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
                FacultyClass
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

                var facultyClass = new FacultyClass(doc);

                facultyClass.save(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve({
                        message: 'Database Seeding: Article\t' + facultyClass.title + ' added'
                    });
                });
            });
        }
    });
}
