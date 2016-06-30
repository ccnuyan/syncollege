var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var serverAgent = require('../serverAgent.js');
var serviceReporter = require('../src/services/statusReporter.js');
var _ = require('lodash');

/**
 * Globals
 */
var app, agent, token, credentials, _user, admin;

/**
 * User routes tests
 */
describe('User Reset Password Route tests', function() {

    before(function(done) {
        // Get application
        var testServer = require('./testServer');
        app = testServer.app();
        agent = testServer.agent();
        done();
    });

    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'M3@n.jsI$Aw3'
        };

        // Create a new user
        _user = {
            username: credentials.username,
            password: credentials.password
        };

        var user = new User(_user);

        User.remove().exec(function() {
            user.save(function(err, data) {
                if (err) {
                    done(err);
                } else {
                    agent.post('/user/login')
                        .send(credentials)
                        .expect(200)
                        .then(function(res) {
                            token = res.body.accessToken;
                            return done();
                        });
                }
            });
        });
    });

    it('should be able to reset user password', function(done) {
        var user = _.clone(_user);

        var modification = {
            oldpassword: user.password,
            newpassword: '123456',
        };
        agent.post('/user/modifypwd')
            .set('Authorization', 'bearer ' + token)
            .send(modification)
            .expect(200)
            .end(function(err, res) {
                // Handle signup error
                if (err) {
                    return done(err);
                }
                res.body.status.should.equal('success');
                return done();
            });
    });

    it('should be unable to reset user with invalid password', function(done) {
        var user = _.clone(_user);

        var modification = {
            oldpassword: user.password,
            newpassword: '12345',
        };
        agent.post('/user/modifypwd')
            .set('Authorization', 'bearer ' + token)
            .send(modification)
            .expect(400)
            .end(function(err, res) {
                // Handle signup error
                if (err) {
                    return done(err);
                }
                res.body.status.should.equal('failure');
                return done();
            });
    });

    it('should be unable to reset user with wrong old password', function(done) {
        var modification = {
            oldpassword: 'wolegeca',
            newpassword: '123456',
        };
        agent.post('/user/modifypwd')
            .set('Authorization', 'bearer ' + token)
            .send(modification)
            .expect(400)
            .end(function(err, res) {
                // Handle signup error
                if (err) {
                    return done(err);
                }
                res.body.status.should.equal('failure');
                return done();
            });
    });


    afterEach(function(done) {
        User.remove().exec(done);
    });

    after(function(done) {
        done();
    });
});
