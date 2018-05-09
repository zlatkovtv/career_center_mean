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

var Premium = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    startedOn: {
        type: Date,
        default: '',
        trim: true
    },
    paymentAmount: {
        type: Number,
        default: '',
        trim: true
    }
});

mongoose.model('Premium', Premium);
