var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var validator = require('validator');
var _ = require('lodash');

var snapshotSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    presented: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String
    },
    theme: {
        type: String,
        default: 'simple'
    },
    allowAnonymous: {
        type: Boolean,
        default: false,
    },
    interactive: {
        type: Boolean,
        default: false,
    },
    presentation: {
        type: Schema.ObjectId,
        ref: 'Presentation',
        required: true
    }
});

snapshotSchema.pre('save', function(next) {
    this.modified = new Date;
    next();
});

module.exports = mongoose.model('Snapshot', snapshotSchema);
