var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginTransactionSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('LoginTransaction', LoginTransactionSchema);
