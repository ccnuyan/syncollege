var stats = require('./stats');
var _ = require('lodash');
var config = require('../config.js');

var presenter = 'someapp';

function pushString(dep, stats, str) {
    if (str.match(/\.js.*$/)) {
        dep.scripts.push(stats.publicPath + str);
    }
    if (str.match(/\.css.*$/)) {
        dep.styles.push(stats.publicPath + str);
    }
}

function pushVenderStaticFiles(dep, str) {
    if (str.match(/\.css.*$/)) {
        dep.styles.push(str);
    } else if (str.match(/\.js.*$/)) {
        dep.scripts.push(str);
    }
}

var addToDependency = function(dep, stats, key) {
    var chunkValue = stats.assetsByChunkName[key];
    if (chunkValue) {
        if (typeof chunkValue === 'string') {
            pushString(dep, stats, chunkValue);
        } else {
            chunkValue.forEach(function(str) {
                pushString(dep, stats, str);
            });
        }
    }
};

module.exports = function(key) {

    var dep = {
        scripts: [],
        styles: [],
    };

    // vender css & js
    config.sharedJs.forEach(function(js) {
        pushVenderStaticFiles(dep, js);
    });

    config.sharedStyles.forEach(function(css) {
        pushVenderStaticFiles(dep, css);
    });

    config.dependencies[key].css.forEach(function(css) {
        pushVenderStaticFiles(dep, css);
    });

    config.dependencies[key].js.forEach(function(css) {
        pushVenderStaticFiles(dep, css);
    });

    addToDependency(dep, stats, 'commons');
    addToDependency(dep, stats, key);

    return dep;
};
