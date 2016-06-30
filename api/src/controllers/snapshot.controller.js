var path = require('path');
var mongoose = require('mongoose');
var Snapshot = mongoose.model('Snapshot');
var SnapshotSubmission = mongoose.model('SnapshotSubmission');

var User = mongoose.model('User');
var _ = require('lodash');
var reporter = require('../services/statusReporter');
var jsdom = require('jsdom');
var uuid = require('uuid');

exports.list = function(req, res, next) {
    User.findById(req.user._id)
        .populate('favorateSnapshots')
        .populate('recentSnapshots')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }
            return res.status(200).json(data);
        });
};

exports.getSubmissions = function(req, res, next) {
    SnapshotSubmission.find({
            snapshot: req.snapshot._id
        })
        .populate('snapshot')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }

            var ret = _.reduce(data, function(sum, value, key) {
                _.assign(sum.submiters, value.submiters);
                sum.sections[value.section] = value.choices;
                return sum;
            }, {
                snapshot: req.snapshot,
                submiters: {

                },
                sections:{}
            });
            return res.status(200).json(ret);
        });
};

exports.remove = function(req, res, next) {
    User.findById(req.user._id)
        .populate('favorateSnapshots')
        .populate('recentSnapshots')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }
            return res.status(200).json(data);
        });
};

exports.start2play = function(req, res, next) {
    var callback = function(struct) {
        res.status(200).send(struct);
    };

    if (req.user.anonymous) {
        return callback({
            user: req.user,
            snapshot: req.snapshot,
            owner: false,
        });
    } else {
        var userUpdator = {
            $addToSet: {
                recentSnapshots: req.snapshot._id
            }
        };

        User.findByIdAndUpdate(req.user._id, userUpdator, {
                new: true
            })
            .populate('favorateSnapshots')
            .populate('recentSnapshots')
            .exec(function(err, user) {
                if (err) {
                    return next(err);
                }
                return callback({
                    user: user,
                    snapshot: req.snapshot,
                    owner: req.snapshot.user.equals(req.user._id)
                });
            });
    }
};

exports.add2favorates = function(req, res, next) {
    var user = req.user;
    var snapshot = req.snapshot;
    var updator = {
        $addToSet: {
            favorateSnapshots: snapshot._id
        }
    };

    User.findByIdAndUpdate(req.user._id, updator, {
            new: true
        })
        .populate('favorateSnapshots')
        .populate('recentSnapshots')
        .exec(function(err, data) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(data);
        });
};

//Middleware
exports.ownerCheckMiddleware = function(req, res, next) {
    if (req.snapshot.user.equals(req.user._id)) {
        req.snapshot.owner = true;
        return next();
    } else {
        return reporter.presetationOwnerValidationError;
    }
};

//Middleware
exports.ownerSetMiddleware = function(req, res, next) {
    if (req.snapshot.user.equals(req.user._id)) {
        req.snapshot.owner = true;
    }
    return next();
};

exports.snapshotByID = function(req, res, next, id) {
    Snapshot.findById(id)
        .exec(function(err, snapshot) {
            if (err) {
                return next(err);
            }
            if (!snapshot) {
                return next({
                    message: 'snapshot specified does not exist'
                });
            }
            req.snapshot = snapshot;
            return next();
        });
};
