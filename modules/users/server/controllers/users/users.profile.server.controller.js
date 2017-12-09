'use strict';

/**
* Module dependencies
*/
var _ = require('lodash'),
fs = require('fs'),
path = require('path'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
mongoose = require('mongoose'),
multer = require('multer'),
multerS3 = require('multer-s3'),
aws = require('aws-sdk'),
amazonS3URI = require('amazon-s3-uri'),
config = require(path.resolve('./config/config')),
User = mongoose.model('User'),
StudentMetadata = mongoose.model('StudentMetadata'),
FacultyMetadata = mongoose.model('FacultyMetadata'),
EmployerMetadata = mongoose.model('EmployerMetadata'),
validator = require('validator'),
Gridfs = require('gridfs-stream');

var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
    aws.config.update({
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey
    });

    s3 = new aws.S3();
}

var db = mongoose.connection.db;
var mongoDriver = mongoose.mongo;
var gfs = new Gridfs(db, mongoDriver);

/**
* Update user details
*/
exports.update = function (req, res) {
    var user = new User(req.body);
    var metadata = null;
    switch (user.roles[0]) {
        case 'student':
            metadata = new StudentMetadata(req.body);
            user.displayName = metadata.firstName + ' ' + metadata.lastName;
            user.studentMetadata = metadata._id;
            break;
        case 'faculty':
            metadata = new FacultyMetadata(req.body);
            user.displayName = metadata.firstName + ' ' + metadata.lastName;
            user.facultyMetadata = metadata._id;
            break;
        case 'employer':
            metadata = new EmployerMetadata(req.body);
            user.displayName = metadata.companyName;
            user.employerMetadata = metadata._id;
            break;
        default:
    }

    StudentMetadata.findOneAndUpdate({ _id: metadata._id }, metadata, { upsert: true }, function (err, returnedMetadata) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });

    User.findOneAndUpdate({ _id: user._id }, user, { upsert: true }, function (err, returnedUser) {
        if (err) {
            console.log(err);
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.password = undefined;
            user.salt = undefined;

            returnedUser[user.roles[0] + 'Metadata'] = metadata;
            req.login(returnedUser, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(returnedUser);
                }
            });
        }
    });
};

exports.uploadFilesForUser = function (req, res) {
    var fieldName = req.body.fieldName;
    var file = req.files.file;
    var writestream = gfs.createWriteStream({
        filename: file.name,
        mode: 'w',
        content_type: file.mimetype,
        metadata: ''
        });

        fs.createReadStream(file.path).pipe(writestream);

        writestream.on('close', function (file) {
            StudentMetadata.findById(req.user.studentMetadata.id, function (err, metadata) {
                metadata[fieldName] = file._id;
                metadata.save(function (err, updatedUser) {
                    return res.json(200, updatedUser);
                });
            });
            fs.unlink(file.path, function (err) {
            console.log('success!');
            });
        });
};

/**
* Update profile picture
*/
exports.changeProfilePicture = function (req, res) {
    var user = req.user;
    var existingImageUrl;
    var multerConfig;


    if (useS3Storage) {
        multerConfig = {
            storage: multerS3({
                s3: s3,
                bucket: config.aws.s3.bucket,
                acl: 'public-read'
            })
        };
    } else {
        multerConfig = config.uploads.profile.image;
    }

    // Filtering to upload only images
    multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

    var upload = multer(multerConfig).single('newProfilePicture');

    if (user) {
        existingImageUrl = user.profileImageURL;
        uploadImage()
        .then(updateUser)
        .then(deleteOldImage)
        .then(login)
        .then(function () {
            res.json(user);
        })
        .catch(function (err) {
            res.status(422).send(err);
        });
    } else {
        res.status(401).send({
            message: 'User is not signed in'
        });
    }

    function uploadImage() {
        return new Promise(function (resolve, reject) {
            upload(req, res, function (uploadError) {
                if (uploadError) {
                    reject(errorHandler.getErrorMessage(uploadError));
                } else {
                    resolve();
                }
            });
        });
    }

    function uploadPdf() {
        return new Promise(function (resolve, reject) {
            upload(req, res, function (uploadError) {
                if (uploadError) {
                    reject(errorHandler.getErrorMessage(uploadError));
                } else {
                    resolve();
                }
            });
        });
    }

    function updateUser() {
        return new Promise(function (resolve, reject) {
            user.profileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
            req.file.location :
            '/' + req.file.path;
            user.save(function (err, theuser) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function deleteOldImage() {
        return new Promise(function (resolve, reject) {
            if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
                if (useS3Storage) {
                    try {
                        var { region, bucket, key } = amazonS3URI(existingImageUrl);
                        var params = {
                            Bucket: config.aws.s3.bucket,
                            Key: key
                        };

                        s3.deleteObject(params, function (err) {
                            if (err) {
                                console.log('Error occurred while deleting old profile picture.');
                                console.log('Check if you have sufficient permissions : ' + err);
                            }

                            resolve();
                        });
                    } catch (err) {
                        console.warn(`${existingImageUrl} is not a valid S3 uri`);

                        return resolve();
                    }
                } else {
                    fs.unlink(path.resolve('.' + existingImageUrl), function (unlinkError) {
                        if (unlinkError) {

                            // If file didn't exist, no need to reject promise
                            if (unlinkError.code === 'ENOENT') {
                                console.log('Removing profile image failed because file did not exist.');
                                return resolve();
                            }

                            console.error(unlinkError);

                            reject({
                                message: 'Error occurred while deleting old profile picture'
                            });
                        } else {
                            resolve();
                        }
                    });
                }
            } else {
                resolve();
            }
        });
    }

    function login() {
        return new Promise(function (resolve, reject) {
            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    resolve();
                }
            });
        });
    }
};

/**
* Send User
*/
exports.me = function (req, res) {
    // Sanitize the user - short term solution. Copied from core.server.controller.js
    // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
    var safeUserObject = null;
    if (req.user) {
        safeUserObject = {
            displayName: validator.escape(req.user.displayName),
            provider: validator.escape(req.user.provider),
            username: validator.escape(req.user.username),
            created: req.user.created.toString(),
            roles: req.user.roles,
            profileImageURL: req.user.profileImageURL,
            email: validator.escape(req.user.email),
            lastName: validator.escape(req.user.lastName),
            firstName: validator.escape(req.user.firstName),
            additionalProvidersData: req.user.additionalProvidersData
        };
    }

    res.json(req.user || null);
};
