var _ = require('lodash');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var mongoose = require('mongoose');
var runSequence = require('run-sequence');

require('./src/model');

var conf = require('./config');

// Nodemon task
gulp.task('nodemon', function() {
  return nodemon({
    script: 'server.js',
    args: ['--dev'],
    ext: 'js',
    watch: _.union('./src')
  }).on('restart', ['eslint']);
});

gulp.task('eslint', function() {
  return gulp.src(['**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('debug', function(done) {
  runSequence('eslint', 'nodemon', done);
});

// Mocha tests task
gulp.task('mocha-model', function(done) {
  var connect = function() {
    console.log(`connecting ${conf.dbconfig.url + conf.dbconfig.name}`);
    mongoose.connect(conf.dbconfig.url + conf.dbconfig.name, function(err) {
      if (err) {
        done(err.message);
      }
      var error;
      // Run the tests
      gulp.src(conf.modelTestSuites)
        .pipe(mocha({
          reporter: 'spec',
          timeout: 10000,
        }))
        .on('error', function(err) {
          console.log(err);
          error = err;
          process.exit();
        })
        .on('end', function() {
          mongoose.disconnect(done);
        });
    });
  };

  connect();
});

// Mocha tests task
gulp.task('mocha-route', function(done) {
  var error;
  // Run the tests
  var callback = function() {
    gulp.src(conf.routeTestSuites)
      .pipe(mocha({
        reporter: 'spec',
        timeout: 10000,
      }))
      .on('error', function(err) {
        console.log(err);
        error = err;
        process.exit();
      })
      .on('end', function() {
        done(error);
        process.exit();
      });
  };

  var testServer = require('./tests/testServer');
  testServer.init(callback);
});
