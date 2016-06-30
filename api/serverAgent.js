var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var assert = require('assert');
var passport = require('passport');
require('./src/model');

var handlers = require('./handlers');
var crossDomainHanlder = require('./crossDomainHanlder');

var app = express();
var conf = require('./config');

app.get('/service/status', function(req, res) {
    res.status(200).send('ok');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(crossDomainHanlder);
conf.morgan && app.use(logger('dev'));

require('./src/security/bearerStrategy')();
require('./src/security/anonymousStrategy')();

app.use(passport.initialize());

app.use('/user/',
    require('./src/controllers/userController'));

app.use('/oauth/',
    require('./src/controllers/oauthController'));

require('./src/routers/initialize.js')(app);

//error handlers
app.use(handlers.logErrors);
app.use(handlers.clientErrorHandler);
app.use(handlers.errorHandler);

var mongoose = require('mongoose');
//luanch api
var connect = function(callback) {
    var cstring = conf.dbconfig.url + conf.dbconfig.name;
    console.log(cstring);
    mongoose.connect(cstring, function(err) {
        if (err) {
            console.log(err.message);
            setTimeout(connect, 10000);
            mongoose.connection.close();
            return;
        }
        var server = http.createServer(app);
        server.listen(conf.port, function() {
            console.log('Express server listening on port ' + conf.port);
            require('./socket.io/io.js')(server);
            if (callback) callback(app);
        });
    });
};

module.exports = connect;
