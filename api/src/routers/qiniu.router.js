var directory = require('../controllers/directories.controller');
var file = require('../controllers/files.controller');
var express = require('express');
var router = express.Router();

router.route('/dir/:parentId/subfile/')
  .post(file.create);

router.param('parentId', directory.parentByID);

module.exports = router;
