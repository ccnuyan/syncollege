// local Strategy is for token validation

var BearerStrategy = require('passport-http-bearer').Strategy;
var passport = require('passport');
var jwt = require('jwt-simple');
var conf = require('../../config');

var strategy = new BearerStrategy(function(token, done) {
    if (token) {
        var user = jwt.decode(token, conf.jwtsecret);
        return done(null, user);
    } else {
        return done('no token provided');
    }
});

module.exports = function() {
    passport.use('bearer', strategy);
    console.log('Strategy bearer initialized');
};
