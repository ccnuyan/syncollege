var argv = require('yargs').argv;
var path = require('path');

var config = {};

config.domain = process.env.DOMAIN;
config.port = '3000';
config.jwtsecret = process.env.JWT_SECRET;
config.qiniu = {
  bucket: process.env.QINIU_BUCKET,
  ak: process.env.QINIU_ACCESS_KEY,
  sk: process.env.QINIU_SECRET_KEY,
};

if (argv.dev) {

  var user = process.env.SYNCOLLEGE_MONGO_USER;
  var pass = process.env.SYNCOLLEGE_MONGO_PASS;
  var host = process.env.SYNCOLLEGE_MONGO_HOST;
  var port = process.env.SYNCOLLEGE_MONGO_PORT;

  config.dbconfig = {
    url: 'mongodb://' + user + ':' + pass + '@' + host + '/'
  };

  config.dbconfig.name = 'syncollege_dev';
  config.qiniu.mode = 'direct';
  config.qiniu.callbackBase = 'not used';
  config.domain = process.env.SYNCOLLEGE_DOMAIN;
  config.port = '3000';
  config.morgan = true;
  config.logger = {
    console: true,
    file: path.join(__dirname, 'log', 'dev.log'),
  };
  console.log('running in dev mode');

} else if (argv.prod) {

  var user = process.env.SYNCOLLEGE_MONGO_PROD_USER;
  var pass = process.env.SYNCOLLEGE_MONGO_PROD_PASS;
  var host = process.env.SYNCOLLEGE_MONGO_PROD_HOST;
  var port = process.env.SYNCOLLEGE_MONGO_PROD_PORT;
  config.dbconfig = {
    url: 'mongodb://' + user + ':' + pass + '@' + host + '/'
  };

  config.dbconfig.name = 'syncollege';
  config.qiniu.mode = 'callback';
  config.qiniu.callbackBase = process.env.SYNCOLLEGE_DOMAIN;
  config.domain = process.env.SYNCOLLEGE_DOMAIN;
  config.port = '3000';
  config.morgan = true;
  config.logger = {
    console: false,
    file: path.join(__dirname, 'log', 'prod.log'),
  };
  console.log('running in prod mode');

} else {

  var user = process.env.SYNCOLLEGE_MONGO_USER;
  var pass = process.env.SYNCOLLEGE_MONGO_PASS;
  var host = process.env.SYNCOLLEGE_MONGO_HOST;
  var port = process.env.SYNCOLLEGE_MONGO_PORT;
  config.dbconfig = {
    url: 'mongodb://' + user + ':' + pass + '@' + host + '/'
  };

  config.qiniu.mode = 'direct';
  config.dbconfig.name = 'syncollege_test';
  config.port = '3001';
  config.morgan = true;
  config.logger = {
    console: false,
    file: path.join(__dirname, 'log', 'test.log'),
  };

  config.routeTestSuites = [];
  config.routeTestSuites.push('./tests/user.resetpassword.route.test.js');
  config.routeTestSuites.push('./tests/presentation.route.test.js');
  config.routeTestSuites.push('./tests/snapshot.route.test.js');
  config.routeTestSuites.push('./tests/directory.route.test.js');
  config.routeTestSuites.push('./tests/file.route.test.js');
  config.routeTestSuites.push('./tests/qiniu.route.test.js');


  config.modelTestSuites = [];
  // config.modelTestSuites.push('./tests/user.model.test.js');
  config.modelTestSuites.push('./tests/snapshot.model.test.js');


  console.log('running in test mode');

};

console.log(config.qiniu);

console.log('user');

module.exports = config;
