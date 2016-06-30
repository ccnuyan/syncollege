var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SnapshotSubmissionSchema = new Schema({
    snapshot: {
        type: Schema.ObjectId,
        ref: 'Snapshot',
        required: true
    },
    section: {
        type: String,
        ref: 'User',
        required: true
    },
    choices: {
        type: Object
    },
    submiters: {
        type: Object,
    }
});

module.exports = mongoose.model('SnapshotSubmission', SnapshotSubmissionSchema);
