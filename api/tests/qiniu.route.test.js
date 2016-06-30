var should = require('should');
var conf = require('../config');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Directory = mongoose.model('Directory');
var File = mongoose.model('File');
var serverAgent = require('../serverAgent.js');
var _ = require('lodash');
var jwt = require('jwt-simple');

/**
 * Globals
 */
var app, agent, credentials, token, rootId, subDir1Id, subDir2Id, _user, _directory, qiniu_ret;

describe('qiniu Route tests', function() {

    before(function(done) {
        // Get application
        var testServer = require('./testServer');
        app = testServer.app();
        agent = testServer.agent();
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

        qiniu_ret = {
            mime: 'image/png',
            size: 1234,
            etag: 'sometag'
        };

        done();
    });

    beforeEach(function(done) {
        Directory.remove().exec(function() {
            User.remove().exec(function() {
                var user = new User(_user);
                var userRoot = new Directory({
                    name: 'root',
                    user: user,
                    depth: 0
                });
                userRoot.save(function() {
                    user.rootDirectory = userRoot._id;
                    user.save(function(err, data) {
                        if (err) {
                            done(err);
                        } else {
                            agent.post('/user/login')
                                .send(credentials)
                                .expect(200)
                                .then(function(res) {
                                    token = res.body.accessToken;
                                    rootId = res.body.payload.rootDirectory;
                                    return done();
                                });
                        }
                    });
                });
            });
        });
    });

    it('should be able to request file upload in root', function(done) {
        agent.post(`/disk/request/upload/dir/${rootId}/subfile/`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                filename: 'wolegeca.jpg'
            })
            .expect(201)
            .end(function(err, res) {
                should.not.exist(err);
                res.body.should.have.property('token');
                res.body.should.have.property('key');
                qiniu_ret.key = res.body.key;

                agent.post(`/qiniu-disk/dir/${rootId}/subfile/`)
                    .set('Authorization', 'Bearer ' + token)
                    .send(qiniu_ret)
                    .expect(201)
                    .end(function(err, res) {
                        should.not.exist(err);
                        agent.get('/disk/root')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end(function(err, res) {
                                should.not.exist(err);
                                return done();
                            });
                    });
            });
    });

    it('should not be able to request file upload in root with invalid file name', function(done) {
        agent.post(`/disk/request/upload/dir/${rootId}/subfile/`)
            .set('Authorization', 'Bearer ' + token)
            .send({
                filename: 'wolegeca'
            })
            .expect(400)
            .end(function(err, res) {
                should.not.exist(err);
                return done();
            });
    });

    afterEach(function(done) {
        User.remove().exec(function() {
            Directory.remove().exec(function(){
                File.remove().exec(done);
            });
        });
    });

    after(function(done) {
        done();
    });
});
