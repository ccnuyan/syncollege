var chance = new require('chance')();
module.exports.newNickname = function() {
    return chance.name();
};
