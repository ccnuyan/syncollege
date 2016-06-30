var passport = require('passport');
var diskPolicy = require('../policies/disk.policy.js');

var auth = passport.authenticate('bearer', {
  session: false
});

module.exports = function(app) {
  app.use('/qiniu-disk/',
    require('./qiniu.router'));

  app.use('/disk/', auth, diskPolicy.isAllowed,
    require('./disk.router'));

  app.use('/presentations/',
    require('./presentation.router'));

  app.use('/snapshots/',
    require('./snapshot.router'));
};
