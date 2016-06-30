var should = require('should');
var mongoose = require('mongoose');
var uuid = require('uuid');
var User = mongoose.model('User');
var Snapshot = mongoose.model('Snapshot');
var SnapshotSubmission = mongoose.model('SnapshotSubmission');

var _ = require('lodash');
var helper = require('./testHelper.js');
var updateSumbmisson = require('../socket.io/submissionService.js').updateSumbmisson;

/**
 * Globals
 */
var detail1, detail2, detail3, invalidUsernames;

/**
 * Unit tests
 */
describe('SnapshotSubmission Model Unit Tests:', function() {

    before(function(done) {
        detail1 = JSON.parse(`{
              "user": {
                    "_id": "573882ef2b97526a1a28be2c",
                    "username": "ccnuyan",
                    "nickname": "严程序"
              },
              "snapshot": "57528bbb480f669b06fc5af3",
              "section": "5747d081-20b6-498a-bd72-5dd3f86c2b8a",
              "choices": {
                    "4cec98eb-3075-4695-9518-ce4e07f6e801": true,
                    "9a9c04fb-7f9d-4f1b-8be3-a50c07cfd9aa": false,
                    "d71c5ddd-bf3d-4513-aeb4-bb1a6f87e498": false,
                    "2b065bac-1f42-4b21-aa07-558b523d8717": false
              }
        }`);

        detail2 = JSON.parse(`{
              "user": {
                    "_id": "573882ef2b97526a1a28be2d",
                    "username": "richluo",
                    "nickname": "罗rich"
              },
              "snapshot": "57528bbb480f669b06fc5af3",
              "section": "5747d081-20b6-498a-bd72-5dd3f86c2b8a",
              "choices": {
                    "4cec98eb-3075-4695-9518-ce4e07f6e801": false,
                    "9a9c04fb-7f9d-4f1b-8be3-a50c07cfd9aa": false,
                    "d71c5ddd-bf3d-4513-aeb4-bb1a6f87e498": true,
                    "2b065bac-1f42-4b21-aa07-558b523d8717": false
              }
        }`);

        detail3 = JSON.parse(`{
              "user": {
                    "_id": "573882ef2b97526a1a28be2d",
                    "username": "richluo",
                    "nickname": "罗rich"
              },
              "snapshot": "57528bbb480f669b06fc5af3",
              "section": "5747d081-20b6-498a-bd72-5dd3f86c2b8a",
              "choices": {
                    "4cec98eb-3075-4695-9518-ce4e07f6e801": true,
                    "9a9c04fb-7f9d-4f1b-8be3-a50c07cfd9aa": false,
                    "d71c5ddd-bf3d-4513-aeb4-bb1a6f87e498": false,
                    "2b065bac-1f42-4b21-aa07-558b523d8717": false
              }
        }`);

        SnapshotSubmission.remove({}, function() {
            done();
        });
    });

    describe('Method Save', function() {
        it('record 1 Should be ok', function(done) {
            updateSumbmisson(detail1, done);
        });

        it('record 2 Should be ok', function(done) {
            updateSumbmisson(detail2, done);
        });

        it('record 3 Should be ok', function(done) {
            updateSumbmisson(detail3, done);
        });
    });

    after(function(done) {
        SnapshotSubmission.remove().exec(done);
    });
});
