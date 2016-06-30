var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Directory = Schema('Directory');
var crypto = require('crypto');
var validator = require('validator');
var _ = require('lodash');

var validatePassword = function(password) {
    return this.password.length <= 16 && this.password.length >= 6;
};

var UserSchema = new Schema({
    // username: {
    //     type: String,
    //     unique: '该用户名已被注册',
    //     required: 'please provide a username',
    //     validate: {
    //         validator: function(v) {
    //             return /^[a-zA-z][a-zA-Z0-9_]{5,15}$/.test(v);
    //         },
    //         message: '{VALUE} 不是一个有效的用户名'
    //     },
    //     trim: true
    // },
    nickname: {
        type: String,
        required: 'please provide a nickname',

    },
    // salt: {
    //     type: String
    // },
    // password: {
    //     type: String,
    //     default: '',
    //     validate: [validatePassword, '密码需要由 6-16 个字符组成']
    // },
    rootDirectory: {
        type: Schema.ObjectId,
        ref: 'Directory'
    },
    qq: {
        type: Object,
    },
    favorateSnapshots: [{
        type: Schema.ObjectId,
        ref: 'Snapshot'
    }],
    recentSnapshots: [{
        type: Schema.ObjectId,
        ref: 'Snapshot'
    }]
});

UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.toJSON = function() {
    var user = this.toObject();

    return _.pick(user, ['_id', 'username', 'nickname', 'rootDirectory', 'favorateSnapshots', 'recentSnapshots']);;
};

UserSchema.methods.authenticate = function(password) {
    var isMatch = this.password === this.hashPassword(password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
