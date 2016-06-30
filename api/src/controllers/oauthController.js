var router = require('express').Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var BindTransaction = mongoose.model('BindTransaction');
var LoginTransaction = mongoose.model('LoginTransaction');
var Directory = mongoose.model('Directory');

var reporter = require('../services/statusReporter');

var conf = require('../../config');
var uuid = require('uuid');

//https://www.npmjs.com/package/request
var request = require('request');

//qq constants
var app_id = '101271080';
var app_key = 'c89c950759846307af5a8425bb9a3a64';
var pcCodeHost = 'https://graph.qq.com/oauth2.0/authorize';
var pcTokenHost = 'https://graph.qq.com/oauth2.0/token';
var infoHost = 'https://graph.qq.com/user/get_user_info';
var pcOpenidHost = 'https://graph.qq.com/oauth2.0/me';
var redirect_uri = 'http://www.syncollege.com/oauth/qq/callback';

function objectToQuery(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    var ret = str.join('&');
    return ret;
}

function queryToObject(query) {
    var pairs = query.split('&'),
        obj = {},
        pair,
        i;

    for (i in pairs) {
        if (pairs[i] === '') continue;

        pair = pairs[i].split('=');
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return obj;
}


/**
 * goGet - sugar for request
 *
 * @param  {type} url      url to request
 * @param  {type} params   params object in query
 * @param  {type} callback callback function
 * @return {type}          undefined
 */
function goGet(url, params, callback) {
    request({
        method: 'GET',
        uri: url + '?' + objectToQuery(params),
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }, callback);
};


//step 1
//luanch the qq authentication approach
router.get('/qq/luanch', function(req, res) {
    var state = uuid.v4();

    var query = {
        response_type: 'code',
        scope: 'get_user_info',
        client_id: app_id,
        redirect_uri: redirect_uri,
        state: state
    };
    var location = pcCodeHost + '?' + objectToQuery(query);
    res.setHeader('location', location);
    res.status(302).send();
});

//step2
router.get('/qq/callback', function(req, res, next) {
    //ref http://wiki.connect.qq.com/oauth2-0%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3

    var state = req.query.state;
    console.log(state);
    //TODO verify state
    var code = req.query.code;
    var url = `${pcTokenHost}?grant_type=authorization_code&code=${code}&client_id=${app_id}&client_secret=${app_key}&redirect_uri=${redirect_uri}`;

    var query = {
        grant_type: 'authorization_code',
        state: state,
        code: code,
        client_id: app_id,
        client_secret: app_key,
        redirect_uri: redirect_uri
    };

    //go get the token
    goGet(pcTokenHost, query, function(error, response, body) {
        if (error) {
            return next(error);
        }

        var bodyObject = queryToObject(body);
        var access_token = bodyObject.access_token;
        var expires_in = bodyObject.expires_in;
        var refresh_toekn = bodyObject.refresh_token;

        var query = {
            access_token: access_token
        };

        //got get the openid
        goGet(pcOpenidHost, query, function(error, response, body) {
            if (error) {
                return next(error);
            }
            var bodyObject = JSON.parse(response.body.match(/{.+}/)[0]);
            var openid = bodyObject.openid;

            var query = {
                openid: openid,
                oauth_consumer_key: app_id,
                access_token: access_token
            };

            //go get the user info
            goGet(infoHost, query, function(error, response, body) {
                if (error) {
                    return next(error);
                }

                var nickname = body.nickname;
                req.oauth = {
                    provider: 'qq'
                };
                req.oauth.qq = {
                    openid: openid,
                    nickname: nickname,
                    access_token: access_token,
                };

                next('route');
            });
        });
    });
});

/**
 * req.provider
 * req[req.provider].openid,
 * req[req.provider].nickname
 * req[req.provider].access_token
 */
//http://expressjs.com/en/guide/using-middleware.html#middleware.router
router.get('/:vender/callback', function(req, res, next) {
    var provider = req.oauth.provider;
    var query = {};
    console.log(req.oauth[provider]);
    query[provider + '.openid'] = req.oauth[provider].openid;
    console.log(query);
    User.findOne(query).exec(function(err, doc) {
        if (err) {
            return next(err);
        } else {
            if (!doc) {

                /**
                 * step 1 get the provider callback info
                 */

                var providerInfo = {
                    openid: req.oauth[provider].openid,
                    access_token: req.oauth[provider].access_token,
                };

                /**
                 * step 2 initialize a user object with nickname and provider info
                 * after this step the format of user should be linkEach
                 * { nickname: '严程序',
                      qq:
                       { openid: 'DC2161A5A64497EDC71552DF6850E092',
                         access_token: 'D9D1085223D7274D3E7A08EFEA3559EA' } }
                 */

                var user = {
                    nickname: req.oauth[provider].nickname
                };

                user[req.oauth.provider] = providerInfo;


                /**
                 * step 3 create disk root for user
                 */
                var userRoot = new Directory({
                    name: 'root',
                    user: newUser,
                    depth: 0
                });

                /**
                 * step 4 fill the accordinate properties
                 */
                var newUser = new User(user);
                newUser.rootDirectory = userRoot._id;
                userRoot.user = newUser._id;

                /**
                 * step 5 db actions
                 */

                userRoot.save(function(err, retDir) {
                    if (err) {
                        return next(err);
                    }
                    newUser.save(function(err, userRet) {
                        if (err) {
                            return next(err);
                        } else {

                            /**
                             * step 6 luanch a login transaction with new user
                             */

                            var loginTransaction = new LoginTransaction({
                                user: userRet,
                            });

                            loginTransaction.save(function(err, transaction) {
                                if (err) {
                                    return next(err);
                                }

                                /**
                                 * step 7 redirect the client to welcome page
                                 */

                                res.setHeader('location', '/welcome/' + transaction._id);
                                res.status(302).send();
                            });
                        }
                    });
                });
            } else {

                /**
                 * step 1 luanch a login transaction with user found
                 */

                var loginTransaction = new LoginTransaction({
                    user: doc,
                });

                loginTransaction.save(function(err, transaction) {
                    if (err) {
                        return next(err);
                    }

                    /**
                     * step 2 redirect the client to welcome page
                     */

                    res.setHeader('location', '/welcome/' + transaction._id);
                    res.status(302).send();
                });
            }
        }
    });
});

module.exports = router;
