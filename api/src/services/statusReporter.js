var conf = require('../../config');
var tokenService = require('./tokenService');

var Response = function(status, message) {
    return {
        status: status,
        message: message
    };
};

var localInfo = {
    id: 'local',
    type: 'bs',
    domain: conf.domain,
};

module.exports = {
    success: function(res) {
        res.status(200).send(Response('success', '成功'));
    },

    userNotExisted: function(res) {
        res.status(400).send(Response('failure', '用户不存在'));
    },

    usernameOrPasswordWrong: function(res) {
        res.status(400).send(Response('failure', '用户名/密码错误'));
    },

    authenticationFailed: function(res) {
        res.status(400).send(Response('failure', '未授权'));
    },

    toBeModifiedPasswordWrong: function(res) {
        res.status(400).send(Response('failure', '旧密码无法通过验证'));
    },

    notAllowed: function(res) {
        res.status(401).send(Response('failure', '不允许这样做'));
    },

    userValidationError: function(res, error) {
        res.status(400).send(Response('failure', error));
    },

    presetationOwnerValidationError: function(res) {
        res.status(400).send(Response('failure', '不允许这样做'));
    },

    parentNotExisted: function(res) {
        res.status(400).send(Response('failure', '父目录不存在'));
    },

    directoryNotExisted: function(res) {
        res.status(400).send(Response('failure', '目录不存在'));
    },

    sourceNotExisted: function(res) {
        res.status(400).send(Response('failure', '源目录不存在'));
    },

    targetNotExisted: function(res) {
        res.status(400).send(Response('failure', '目标目录不存在'));
    },

    fileNotExisted: function(res) {
        res.status(400).send(Response('failure', '文件不存在'));
    },

    directoryNameIlligal: function(res) {
        res.status(400).send(Response('failure', '这个目录名不合法'));
    },

    fileNameIlligal: function(res) {
        res.status(400).send(Response('failure', '这个文件名不合法'));
    },

    fileExtensionNotExisted: function(res) {
        res.status(400).send(Response('failure', '文件扩展名不存在, 拒绝上传'));
    },

    notAllowedToCreateDeeperDirectory: function(res) {
        res.status(400).send(Response('failure', '不允许创建更深层次的目录'));
    },

    notAllowedToModifyFileExtension: function(res) {
        res.status(400).send(Response('failure', '不允许修改文件扩展名'));
    },

    createAndSendToken: function(res, user) {
        var payload = {
            _id: user._id,
            username: user.username,
            nickname: user.nickname,
            anonymous: false,
            rootDirectory: user.rootDirectory,
        };

        var token = tokenService.generateToken(payload);

        res.status(200).send({
            payload: payload,
            accessToken: token
        });
    },

    createAndSendAnonymousToken: function(res, user) {
        var payload = {
            _id: user._id,
            username: user.username,
            nickname: user.nickname,
            anonymous: true,
            //no rootDirectory for anonymous user
        };

        var token = tokenService.generateToken(payload);

        res.status(200).send({
            payload: payload,
            accessToken: token
        });
    }
};
