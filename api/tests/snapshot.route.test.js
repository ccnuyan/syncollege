var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var serverAgent = require('../serverAgent.js');
var Snapshot = mongoose.model('Snapshot');
var Presentation = mongoose.model('Presentation');
var uuid = require('uuid');

var _ = require('lodash');

var ASQ = require('asynquence');

/**
 * Globals
 */
var app, token, visitor_token, agent, credentials, _user, admin, _presentation, _snapshot;

/**
 * User routes tests
 */
describe('Snapshot tests', function() {
    before(function(done) {
        // Get application
        var testServer = require('./testServer');
        app = testServer.app();
        agent = testServer.agent();

        var visitorCredentials = {
            username: 'visitor',
            password: 'M3@n.jsI$Aw3'
        };

        // Create a new user
        _visitor = {
            username: visitorCredentials.username,
            password: visitorCredentials.password
        };
        var visitor = new User(_visitor);

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

        anonymousToken = new Buffer('anonymous:' + uuid.v4()).toString('base64');

        var initialize = function(callback) {
            User.remove().exec(function(err) {
                should.not.exist(err);
                visitor.save(function(err) {
                    should.not.exist(err);
                    user.save(function(err, data) {
                        should.not.exist(err);
                        agent.post('/user/login')
                            .send(credentials)
                            .expect(200)
                            .then(function(res) {
                                token = res.body.accessToken;
                                agent.post('/user/login')
                                    .send(visitorCredentials)
                                    .expect(200)
                                    .then(function(res) {
                                        visitor_token = res.body.accessToken;
                                        return callback();
                                    });
                            });
                    });
                });
            });
        };

        var setupPresentation = function(callback) {
            should.exist(token);
            agent.post('/presentations')
                .set('authorization', 'bearer ' + token)
                .send({
                    name: 'new presentation'
                })
                .expect(201)
                .end(function(err, res) {
                    should.not.exist(err);
                    _presentation = res.body._id;
                    return callback();
                });
        };

        var request2playPresentation = function(callback) {
            should.exist(_presentation);
            should.exist(token);
            agent.post('/presentations/request2play/' + _presentation)
                .set('authorization', 'bearer ' + token)
                .expect(201)
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res.body._id);
                    _snapshot = res.body._id;
                    return callback();
                });
        };

        ASQ(initialize)
            .then(setupPresentation)
            .then(request2playPresentation)
            .val(function() {
                done();
            })
            .or(function(err) {
                console.log('ERROROROROOROROR');
                done(err);
            });
    });

    it('anonymous user should be able to start 2 play snapshot', function(done) {
        should.exist(_snapshot);
        agent.post('/snapshots/start2play/' + _snapshot)
            .set('authorization', 'basic ' + anonymousToken)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    res.body.snapshot.name.should.equal('new presentation');
                    done();
                }
            });
    });


    it('visitor should be able to start 2 play snapshot', function(done) {
        agent.post('/snapshots/start2play/' + _snapshot)
            .set('authorization', 'bearer ' + visitor_token)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    res.body.snapshot.name.should.equal('new presentation');
                    should.exist(res.body.user.recentSnapshots);
                    res.body.user.recentSnapshots.should.be.an.Array();
                    res.body.user.recentSnapshots.should.have.length(1);
                    done();
                }
            });
    });


    it('author should be able to start 2 play snapshot', function(done) {
        agent.post('/snapshots/start2play/' + _snapshot)
            .set('authorization', 'bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    res.body.snapshot.name.should.equal('new presentation');
                    should.exist(res.body.user.recentSnapshots);
                    res.body.user.recentSnapshots.should.be.an.Array();
                    res.body.user.recentSnapshots.should.have.length(1);
                    done();
                }
            });
    });


    it('author should be able to add to favorate', function(done) {
        agent.post('/snapshots/add2favorates/' + _snapshot)
            .set('authorization', 'bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    should.exist(res.body.favorateSnapshots);
                    res.body.favorateSnapshots.should.be.an.Array();
                    res.body.favorateSnapshots.should.have.length(1);
                    done();
                }
            });
    });
});
