var path = require('path');
var mongoose = require('mongoose');
var Directory = mongoose.model('Directory');
var File = mongoose.model('File');
var qiniu = require('qiniu');
var conf = require('../../config');
var _ = require('lodash');

var os = require('os');

qiniu.conf.ACCESS_KEY = conf.qiniu.ak;
qiniu.conf.SECRET_KEY = conf.qiniu.sk;
var bucket = conf.qiniu.bucket;

var FileObject = mongoose.model('FileObject');
var populateParentToSubfiles = require('./populator').populateParentToSubfiles;
var populateParentToFile = require('./populator').populateParentToFile;

var reporter = require('../services/statusReporter');

exports.read = function(req, res) {
  return res.status(200).json(populateParentToFile(req.file, req.parent));
};

exports.update = function(req, res, next) {
  var file = req.file;
  var fileObject = req.file.fileObject;

  file.name = req.body.name;

  var err = file.validateSync();
  if (err) {
    return reporter.fileNameIlligal(res);
  }
  file.save(function(err, retDiskFile) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      return res.status(200).json(populateParentToFile(retDiskFile, req.parent));
    }
  });
};

exports.delete = function(req, res, next) {
  var parent = req.parent;
  var file = req.file;
  var fileObject = req.file.fileObject;

  Directory.findByIdAndUpdate(parent._id, {
      $pull: {
        subFiles: file._id
      }
    }, {
      new: true
    })
    .exec(function(outerError) {
      if (outerError) {
        return next(outerError);
      }
      file.remove();
      fileObject.remove();

      return res.status(200).json(populateParentToFile(file, req.parent));
    });
};

/**
 * this function should be called by qiniu;
 */
exports.create = function(req, res, next) {
  var key = req.body.key;
  var mime = req.body.mime;
  var etag = req.body.etag;
  var size = req.body.size;

  var parent = req.parent;

  FileObject.findByIdAndUpdate(key, {
    $set: {
      mime: mime,
      etag: etag,
      size: size,
    }
  }, {
    upsert: false,
    new: true,
  }, function(err, fileObject) {
    if (err) {
      next(err);
    }

    var file = new File({
      user: fileObject.user,
      fileObject: fileObject._id,
      name: fileObject.realName,
      parent: parent._id,
      ext: fileObject.realName.split('.').pop()
    });

    file.save(function(err, fileRet) {
      if (err) {
        return next(err);
      }

      parent.subFiles.push(fileRet._id);
      parent.save(function(err) {
        if (err) {
          return next(err);
        }

        var file = populateParentToFile(fileRet, req.parent);
        file.fileObject = fileObject.toObject();

        return res.status(201).json(file);
      });
    });
  });
};

exports.requestUploadToDirectory = function(req, res) {
  var parent = req.parent;

  var fileObject = new FileObject({
    realName: req.body.filename,
    user: req.user._id
  });

  if(fileObject.validateSync()){
    return reporter.fileNameIlligal(res);
  }

  //http://eslint.org/docs/rules/quotes
  fileObject.save(function(err) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + fileObject._id);
    if (conf.qiniu.mode === 'callback') {
      var callbackBase = conf.qiniu.callbackBase;
      var callbackUrl = `${callbackBase}api/qiniu-disk/dir/${parent._id}/subfile/`;
      putPolicy.callbackUrl = callbackUrl;
      putPolicy.callbackBody = `size=$(fsize)&mime=$(mimeType)&key=$(key)&etag=$(etag)`;
    } else {
      putPolicy.returnBody = `{
        "size":$(fsize),"mime":$(mimeType),"key":$(key),"etag":$(etag)
      }`;
    }
    res.status(201).send({
      token: putPolicy.token(),
      key: fileObject._id,
      callbackUrl: callbackUrl
    });
  });
};

exports.requestDownload = function(req, res) {
  var callback = function(err, transaction) {
    if (err) {
      return next(err);
    }
    return res.status(201).send(transaction);
  };
  var fileName = req.file.fileObject.name;
  storageRequest.downloadRequest(req.file.fileObject.storage_box_id, req.file.fileObject.storage_object_id, fileName, callback);
};

exports.move = function(req, res, next) {

  var sourceDir = req.sourceDirectory;
  var targetDir = req.targetDirectory;

  var file = req.file;


  if (targetDir._id.equals(sourceDir._id) ||
    !_.some(sourceDir.subFiles, {
      _id: file._id
    }) ||
    !sourceDir.user.equals(req.user._id) ||
    !targetDir.user.equals(req.user._id) ||
    _.some(targetDir.subFiles, {
      _id: file._id
    })) {
    return next({
      message: 'not allowed'
    });
  }

  Directory.findByIdAndUpdate(targetDir._id, {
      $push: {
        subFiles: file._id
      }
    }, {
      new: true
    })
    .populate('subDirectories')
    .populate('subFiles')
    .populate('subFiles.fileObject')
    .exec(function(outerError, newTargetDir) {
      if (outerError) {
        return next(outerError);
      }
      Directory.findByIdAndUpdate(sourceDir._id, {
          $pull: {
            subFiles: file._id
          }
        }, {
          new: true
        })
        .populate('subDirectories')
        .populate('subFiles')
        .populate('subFiles.fileObject')
        .exec(function(err, newSourceDir) {
          if (err) {
            return next(err);
          }

          var ret = {};
          ret.source = populateParentToSubfiles(newSourceDir);
          ret.target = populateParentToSubfiles(newTargetDir);
          ret.file = populateParentToFile(file, req.targetDirectory);

          return res.status(200).json(ret);
        });
    });
};

exports.parentCheck = function(req, res, next) {
  var parent = req.parent.toObject();
  var file = req.file.toObject();
  if (_.some(parent.subFiles, {
      _id: file._id
    })) {
    return next();
  } else {
    return next({
      status: 'failure',
      message: 'parentCheck failed'
    });
  }
};

exports.fileByID = function(req, res, next, id) {
  File.findById(id)
    .populate('fileObject')
    .exec(function(err, file) {
      if (err) {
        return next(err);
      }
      if (!file) {
        return next({
          message: 'disk file specified does not exist'
        });
      }

      req.file = file;
      return next();
    });
};
