// local Strategy is for and logining
var BasicStrategy = require('passport-http').BasicStrategy;
var passport = require('passport');

var strategy = new BasicStrategy(
    function(userid, password, done) {
        if (userid !== 'anonymous') {
            return done('authentication err');
        } else {
            return done(null, {
                anonymous: true,
                _id: password
            });
        }
    }
);

module.exports = function() {
    passport.use('anonymous', strategy);
    console.log('Strategy anonymous initialized');
};
