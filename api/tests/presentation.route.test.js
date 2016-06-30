var should = require('should');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var serverAgent = require('../serverAgent.js');
var Presentation = mongoose.model('Presentation');

var _ = require('lodash');

/**
 * Globals
 */
var app, token, agent, credentials, _user, admin;

/**
 * User routes tests
 */
describe('Presentation tests', function() {

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

    it('should be able to create presentation & get the list', function(done) {
        agent.post('/presentations')
            .set('authorization', 'bearer ' + token)
            .send({
                name: 'new presentation'
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(res);
                }
                res.body.name.should.equal('new presentation');

                agent.get('/presentations')
                    .set('authorization', 'bearer ' + token)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.body[0].name.should.equal('new presentation');
                        return done();
                    });
            });
    });

    it('should be able to create presentation & modify it & query it', function(done) {
        agent.post('/presentations')
            .set('authorization', 'bearer ' + token)
            .send({
                name: 'new presentation'
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(res);
                }
                res.body.name.should.equal('new presentation');
                agent.put('/presentations/' + res.body._id)
                    .set('authorization', 'bearer ' + token)
                    .send({
                        content: res.body.content
                    })
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.body.name.should.equal('new presentation');
                        should.exist(res.body.content);
                        agent.get('/presentations')
                            .set('authorization', 'bearer ' + token)
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    return done(err);
                                }
                                res.body[0].name.should.equal('new presentation');

                                return done();
                            });
                    });
            });
    });

    it('should be able to create presentation & remove it & list empty', function(done) {
        agent.post('/presentations')
            .set('authorization', 'bearer ' + token)
            .send({
                name: 'new presentation'
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(res);
                }
                res.body.name.should.equal('new presentation');
                agent.delete('/presentations/' + res.body._id)
                    .set('authorization', 'bearer ' + token)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.body.name.should.equal('new presentation');
                        agent.get('/presentations')
                            .set('authorization', 'bearer ' + token)
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    return done(err);
                                }
                                res.body.length.should.equal(0);

                                return done();
                            });
                    });
            });
    });

    it('should be able to create snapshot to play', function(done) {
        agent.post('/presentations')
            .set('authorization', 'bearer ' + token)
            .send({
                name: 'new presentation'
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    return done(res);
                }
                res.body.name.should.equal('new presentation');
                agent.post('/presentations/request2play/' + res.body._id)
                    .set('authorization', 'bearer ' + token)
                    .expect(201)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        res.body.name.should.equal('new presentation');
                        res.body.allowAnonymous.should.equal(false);
                        res.body.interactive.should.equal(false);
                        done();
                    });
            });
    });

    afterEach(function(done) {
        User.remove().exec(() =>
            Presentation.remove().exec(done));
    });

    after(function(done) {
        User.remove({}, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
});
