'use strict';

var mongoose = require('mongoose'),
path = require('path'),
config = require(path.resolve('./config/config')),
Schema = mongoose.Schema,
crypto = require('crypto'),
validator = require('validator'),
generatePassword = require('generate-password'),
owasp = require('owasp-password-strength-test'),
chalk = require('chalk');

owasp.config(config.shared.owasp);

var UserFilesSchema = new Schema({
    fileName: {
        type: String,
        trim: true,
        default: ''
    }
});

mongoose.model('fs.files', UserFilesSchema);
