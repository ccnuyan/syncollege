//http://webpack.github.io/docs/
var webpack = require('webpack');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var fs = require('fs');
var argv = require('yargs').argv;
var webpackConfig = require('./webpack.config.js');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var ProgressBar = require('progress');
var config = require('./config');

var statsCallback = function(err, stats) {
    if (err) {
        return console.error(err);
    }
    var jsonStats = stats.toJson(webpackConfig.statsConf);
    if (jsonStats.errors.length > 0) {
        console.error('ERROR*************************');
        console.error(jsonStats.errors[0]);
    }
    if (jsonStats.warnings.length > 0) {
        console.warn('WARNING*************************');
        console.warn(jsonStats.warnings[0]);
    }

    console.info('stats updated');
    var result = JSON.stringify(jsonStats, null, 2);
    return fs.writeFile(config.webpack.statsOutput, result, 'utf8');
};


if (argv.dev) {
    console.warn('starting...');

    var compiler = webpack(webpackConfig);

    //https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js
    compiler.plugin('done', function(stats) {
        statsCallback(null, stats);
    }.bind(this));

    var server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(webpackConfig.devPort);
}

if (argv.build) {
    console.log('starting...');

    var compiler = webpack(webpackConfig);

    var bar = new ProgressBar(':bar :message', {
        total: 100
    });

    var current = 0;
    compiler.apply(new ProgressPlugin(function(percentage, msg) {
        var pc = percentage * 100 - current;
        bar.tick(pc, {
            message: msg
        });
        if (bar.complete) {
            console.info('\ncomplete\n');
        }
        current = percentage * 100;
    }));
    compiler.run(statsCallback);
}
