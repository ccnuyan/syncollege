var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var Renderer = require('./renderer.js');
var renderer = new Renderer();
var config = require('../config');

var port = config.port || 8000;

var app = express();

// serve the js and css assets
// We can cache them as they've been hashed

app.use('/_assets',
  express.static(path.join(__dirname, '../build/public'), {
    maxAge: '100d'
  }));

// serve the static assets
app.use('/',
  express.static(path.join(__dirname, '../public'), {
    maxAge: '100d'
  }));


if (config.randomException) {
  // artifical delay and errors
  app.use(function(req, res, next) {
    if (Math.random() < 0.01) {
      // randomly fail to test error handling
      res.statusCode = 500;
      res.end('Random fail! (you may remove this code in your app)');
      return;
    }
    setTimeout(next, Math.ceil(Math.random() * config.maxDelay));
  });
}

app.use(bodyParser.json());

var requestRender = function(req, res, appName) {
  renderer.render(
    req.path,
    function(err, html) {
      if (err) {
        res.statusCode = 500;
        res.contentType = 'text; charset=utf8';
        res.end(err.message);
        return;
      }
      res.contentType = 'text/html; charset=utf8';
      res.end(html);
    }, appName);
};

app.get(['/:app', '/:app/*'], function(req, res) {
  requestRender(req, res, req.params.app.toLowerCase());
});

app.get('/', function(req, res) {
  requestRender(req, res, 'main');
});

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
