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

var EmployerMetadataSchema = new Schema({
    facultyPosition: {
        type: String,
        trim: true,
        default: ''
    },
    companyName: {
        type: String,
        default: '',
        trim: true
    },
    companyWebsite: {
        type: String,
        default: '',
        trim: true
    },
    companyPhone: {
        type: String,
        default: '',
        trim: true
    },
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    isPersonalProfileCompleted: {
        type: Boolean,
        default: false
    },
    personality: {
        type: String,
        default: ''
    }
});

mongoose.model('EmployerMetadata', EmployerMetadataSchema);
