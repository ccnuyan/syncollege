var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
var stats = require('./stats');
var _ = require('lodash');
var config = require('../config.js');

var dependencies = require('./dependencies');

function Renderer() {
    this.html = {};
}

function stringArrMaker(cssArr) {
    return _.reduce(cssArr, function(ret, item) {
        return ret + '"' + item + '",\n';
    }, '');
}

Renderer.prototype.render = function(_path, callback, app) {
    if (app !== 'edit' && app !== 'present' && app !== 'play') {
        app = 'main';
    }

    if (this.html[app])
        return callback(null, this.html[app]);

    this.html[app] = html;

    console.log(app);
    var dep = dependencies(app);
    console.log(dep);
    console.log('------------------------');

    this.html[app] = this.html[app].replace('__CSS__', stringArrMaker(dep.styles));
    this.html[app] = this.html[app].replace('__JS__', stringArrMaker(dep.scripts));

    this.html[app] = this.html[app].replace('__TITLE__', config.title);
    this.html[app] = this.html[app].replace('__IO_HOST__', config.ioHost);
    this.html[app] = this.html[app].replace('__HOST__', config.domain);
    this.html[app] = this.html[app].replace('__API_BASE__', config.apiBase);
    this.html[app] = this.html[app].replace('__ASSETS__', config.assets);
    this.html[app] = this.html[app].replace('__REVEAL_PLUGIN_PATH__', config.revealPluginPath);
    this.html[app] = this.html[app].replace('__CONTAINER__', config.qiniucontainer);
    this.html[app] = this.html[app].replace('__DEV__', config.dev);
    this.html[app] = this.html[app].replace('__QINIU_URL__', config.qiniu_url);

    return callback(null, this.html[app]);
};

module.exports = Renderer;
