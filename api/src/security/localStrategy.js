//get rid of local register and login, so this startegy is of no use now;

// local Strategy is for and logining
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

var User = require('mongoose').model('User');

var strategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password, done) {
  var query = {
    username: username
  };

  User.findOne(query, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, 'wrong email/password');
    }
    if (!user.authenticate(password)) {
      return done(null, false, 'wrong email/password');
    }
    return done(null, user);
  });
});

module.exports = function() {
  passport.use('local', strategy);
  console.log('Strategy local initialized');
};
