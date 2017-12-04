'use strict';

/**
* Module dependencies
*/
var path = require('path'),
mongoose = require('mongoose'),
User = mongoose.model('User'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.getAllStudents = function (req, res) {
    User.find({ roles: "student" }).exec(function (err, users) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(users);
        }
    });
};
