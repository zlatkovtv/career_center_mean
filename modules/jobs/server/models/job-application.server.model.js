'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

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
