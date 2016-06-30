var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fileObject: {
    type: Schema.ObjectId,
    ref: 'FileObject'
  },
  ext: {
    type: String,
  }
});

FileSchema.path('name').validate(function(value) {
  if (!value) return false;

  var lengthCheck = value.length <= 128 && value.length >= 1;
  if (!lengthCheck) return false;

  var fileExtensionCheck = /.+\.([^.]+)$/.test(value);
  if (!fileExtensionCheck) return false;

  var validCheck = /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/.test(value);
  if (!validCheck) return false;

  if(this.name.split('.').pop() !== this.ext){
    return false;
  }

  return true;
}, 'Invalid name');

module.exports = mongoose.model('File', FileSchema);
