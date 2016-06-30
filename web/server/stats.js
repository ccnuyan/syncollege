var path = require('path');
var config = require('../config.js');
var stats = require(config.webpack.statsOutput);
console.log(stats.publicPath);
console.log(JSON.stringify(stats.assetsByChunkName, null, 2));

module.exports = stats;
