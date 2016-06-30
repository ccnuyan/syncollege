var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileObjectSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    realName: {
        type: String,
    },
    created: {
        type: Date,
    },
    size: {
        type: Number
    },
    mime: {
        type: String
    },
    etag: {
        type: String
    }
});

FileObjectSchema.path('realName').validate(function(value) {
    if (!value) return false;


    var lengthCheck = value.length <= 128 && value.length >= 1;
    if (!lengthCheck) return false;

    var fileExtensionCheck = /.+\.([^.]+)$/.test(value);

    if (!fileExtensionCheck) {
        return false;
    }

    var validCheck = /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/.test(value);

    if (!validCheck) {
        return false;
    }

    return true;
}, 'Invalid file name');

module.exports = mongoose.model('FileObject', FileObjectSchema);
