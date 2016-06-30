var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BindTransactionSchema = new Schema({
    provider: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    openid: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('BindTransaction', BindTransactionSchema);
