'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var JobApplicationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('JobApplication', JobApplicationSchema);
