var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var BindTransaction = mongoose.model('BindTransaction');
var LoginTransaction = mongoose.model('LoginTransaction');
var jwt = require('jwt-simple');
var passport = require('passport');
var conf = require('../../config');
var uuid = require('uuid');
var userNicknameGenerator = require('../services/userNicknameGenerator');

var Directory = require('mongoose').model('Directory');

var reporter = require('../services/statusReporter');

var errorHandler = function(err, req, res, next) {
    switch (err.name) {
        case 'MongoError':
            var error = '该用户名已经被注册';
            return reporter.userValidationError(res, error);
            break;
        case 'ValidationError':
            var errors = err.errors;
            var error = errors[Object.keys(errors)[0]].message;
            return reporter.userValidationError(res, error);
            break;
        default:
            next(err);
    }
};

router.post('/anonymous-login', function(req, res, next) {
    var name = userNicknameGenerator.newNickname();
    var user = {
        _id: uuid.v4(),
        username: name,
        nickname: name
    };
    reporter.createAndSendAnonymousToken(res, user);
}, errorHandler);

router.post('/login/:loginTransactionId', function(req, res) {
    return reporter.createAndSendToken(res, req.user);
});

router.get('/info', passport.authenticate('bearer', {
    session: false
}), function(req, res, next) {
    if (req.user.anonymous) {
        return res.status(200).send(req.user);;
    } else {
        User.findById(req.user._id).exec(function(err, userReturn) {
            if (err) {
                return next(err);
            }
            if (!userReturn) {
                return reporter.userNotExisted(res);
            }
            res.status(200).send(userReturn);
        });
    }
});

router.post('/modifypwd', passport.authenticate('bearer', {
    session: false
}), function(req, res, next) {
    User.findById(req.user._id).exec(function(err, userReturn) {
        if (err) {
            return next(err);
        }
        if (!userReturn) {
            return reporter.userNotExisted(res);
        }
        if (userReturn.authenticate(req.body.oldpassword)) {
            userReturn.password = req.body.newpassword;

            userReturn.save(function(err, userSaved) {
                if (err) {
                    next(err);
                } else {
                    return reporter.success(res);
                }
            });
        } else {
            return reporter.toBeModifiedPasswordWrong(res);
        }
    });
}, errorHandler);

router.post('/forgetpassword', function(req, res) {
    res.status(200).json(req.user);
});

router.param('bindTransactionId', function(req, res, next, id) {
    BindTransaction.findById(id)
        .exec(function(err, bindTransaction) {
            if (err) {
                return next(err);
            }
            if (!bindTransaction) {
                return next({
                    message: 'bindTransaction specified does not exist'
                });
            }

            req.bindTransaction = bindTransaction;
            return next();
        });
});



router.param('loginTransactionId', function(req, res, next, id) {
    LoginTransaction.findById(id)
        .populate('user')
        .exec(function(err, loginTransaction) {
            if (err) {
                return next(err);
            }
            if (!loginTransaction) {
                return next({
                    message: 'loginTransaction specified does not exist'
                });
            }

            req.user = loginTransaction.user;
            return next();
        });
});

module.exports = router;
