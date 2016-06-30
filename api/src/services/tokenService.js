var jwt = require('jwt-simple');
var conf = require('../../config');

module.exports = {
    generateToken: function(payload) {
        var token = jwt.encode(payload, conf.jwtsecret);
        return token;
    },
};
