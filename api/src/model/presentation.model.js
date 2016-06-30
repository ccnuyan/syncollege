var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var validator = require('validator');
var _ = require('lodash');

var presentationSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String
    },
    theme: {
        type: String,
        default: 'simple'
    }
});

presentationSchema.pre('save', function(next) {
    this.modified = new Date;
    next();
});

module.exports = mongoose.model('Presentation', presentationSchema);
