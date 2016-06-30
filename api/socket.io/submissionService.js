var mongoose = require('mongoose');
var SnapshotSubmission = mongoose.model('SnapshotSubmission');
var _ = require('lodash');

function updateSumbmisson(detail, cb) {
    var choicesupdater = _.reduce(detail.choices, function(ret, trueorfalse, key) {
        if (trueorfalse) {
            ret.$addToSet['choices.' + key] = detail.user._id;
        } else {
            ret.$pull['choices.' + key] = {
                $in: [detail.user._id]
            };
        }
        return ret;
    }, {
        $addToSet: {},
        $pull: {},
    });

    var submiters = {};

    submiters['submiters.' + detail.user._id] = detail.user;

    var updater = _.assign(choicesupdater, submiters);

    var purifiedUpdater = _.reduce(updater,function(ret,value,key){
        if(!_.isEmpty(updater[key])){
            ret[key] = value;
        }
        return ret;
    },{});

    var query = {
        snapshot: detail.snapshot,
        section: detail.section
    };

    var options = {
        upsert: true,
        new: true
    };

    SnapshotSubmission.findOneAndUpdate(query, purifiedUpdater, options, function(err, data) {
        cb(err, data);
    });
}

function getSnapshotSubmissions(snapshot, cb) {
    SnapshotSubmission.find({
        snapshot: snapshot
    }, cb);
}

module.exports = {
    updateSumbmisson,
    getSnapshotSubmissions,
};
