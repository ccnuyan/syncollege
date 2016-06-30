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
var app, agent, credentials, token, rootId, subDir1Id, subDir2Id, _user, _directory, qiniu_ret, file_id;

var tfObj = {
    name: 'file.txt',
    etag: 'etagid',
    size: 100,
    mime: 'text/plain',
};

describe('File Route tests', function() {

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

        //创建了根目录 获取了token
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
                                    return done();
                                });
                        }
                    });
                });
            });
        });
    });

    beforeEach(function(done) {
        agent.get('/disk/root')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                rootId = res.body._id;
                agent.post('/disk/dir/' + rootId + '/subdir/')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        name: 'valid name 1'
                    })
                    .expect(201)
                    .end(function(err, res) {
                        should.not.exist(err);
                        subDir1Id = res.body._id;
                        agent.post('/disk/dir/' + rootId + '/subdir/')
                            .set('Authorization', 'Bearer ' + token)
                            .send({
                                name: 'valid name 2'
                            })
                            .expect(201)
                            .end(function(err, res) {
                                should.not.exist(err);
                                subDir2Id = res.body._id;

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
                                                res.body.should.have.property('_id');
                                                file_id = res.body._id;
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    it('should be able to delete file in root', function(done) {
        agent.delete('/disk/dir/' + rootId + '/subfile/' + file_id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                res.body.should.have.property('parent');
                res.body.parent.should.equal(rootId);
                should.not.exist(err);
                done();
            });
    });

    it('should be able to rename file in root', function(done) {
        agent.put('/disk/dir/' + rootId + '/subfile/' + file_id)
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'new name.jpg'
            })
            .expect(200)
            .end(function(err, res) {
                res.body.should.have.property('parent');
                res.body.name.should.equal('new name.jpg');
                should.not.exist(err);
                done();
            });
    });

    it('should not be able to rename file to another extension', function(done) {
        agent.put('/disk/dir/' + rootId + '/subfile/' + file_id)
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'new name.ext'
            })
            .expect(400)
            .end(function(err, res) {
                res.body.status.should.equal('failure');
                done();
            });
    });

    it('should not be able to rename file to just extension', function(done) {
        agent.put('/disk/dir/' + rootId + '/subfile/' + file_id)
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'jpg'
            })
            .expect(400)
            .end(function(err, res) {
                res.body.status.should.equal('failure');
                done();
            });
    });

    it('should be able to move file', function(done) {
        agent.put('/disk/move/' + file_id + '/from/' + rootId + '/to/' + subDir1Id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                done();
            });
    });

    after(function(done) {
        done();
    });
});
