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

var StudentMetadataSchema = new Schema({
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
    },
    languages: {
        type: Array,
        default: []
    },
    techSkills: {
        type: Array,
        default: []
    },
    softSkills: {
        type: Array,
        default: []
    },
    otherSkills: {
        type: String,
        default: ''
    },
    finalYear: {
        type: Boolean,
        default: false
    },
    enrolled: {
        type: Boolean,
        default: false
    },
    subscribe: {
        type: Boolean,
        default: false
    },
    cv: {
        type: Schema.Types.ObjectId,
        ref: "fs.files"
    },
    motivation: {
        type: Schema.Types.ObjectId,
        ref: "fs.files"
    },
    recommendation: {
        type: Schema.Types.ObjectId,
        ref: "fs.files"
    },
    additionalDocument: {
        type: Schema.Types.ObjectId,
        ref: "fs.files"
    }
});

mongoose.model('StudentMetadata', StudentMetadataSchema);
