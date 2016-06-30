//https://www.gitbook.com/book/toobug/webpack-guide
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var loadersByExtension = require('./loadersByExtension');
var routerHandlers = require('.//server/router-handlers/async');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var config = require('./config');

/* constants */
var additionalLoaders = [];
var aliasLoader = {};
var externals = [];

var options = config.webpack.options;

var modulesDirectories = ['web_modules', 'node_modules'];
var extensions = ['', '.web.js', '.js', '.jsx'];
var root = path.join(__dirname, 'src');
var alias = {};

console.log(`the __dirname is ${__dirname}`);
console.log(`the root is ${root}`);

var publicPath = options.devServer ? 'http://localhost:' + options.devPort + '/_assets/' : '/_assets/';

/* app list */
var entry = {
    //rawjs
    editor: './src/js/editor/editor.js',
    vote: './src/js/plugins/vote.js',
    syncplayer: './src/js/plugins/syncplayer.js',

    //react
    main: './src/components/appMain/Index.jsx',
    edit: './src/components/appEdit/Index.jsx',
    present: './src/components/appPresent/Index.jsx',
    play: './src/components/appPlay/Index.jsx',

    //themes
    black: './reveal/css/theme/source/black.scss',
    white: './reveal/css/theme/source/white.scss',
    simple: './reveal/css/theme/source/simple.scss',
};

/* https://webpack.github.io/docs/list-of-plugins.html#prefetchplugin */
var plugins = [
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
];

/* all loaders but stylesheets */
var loaders = {
    'jsx': options.hot ? ['react-hot-loader', 'babel-loader'] : 'babel-loader',
    'js': {
        loader: 'babel-loader',
        include: path.join(__dirname, 'src')
    },
    'json': 'json-loader',
    'coffee': 'coffee-redux-loader',
    'json5': 'json5-loader',
    'txt': 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
    'woff|woff2': 'url-loader?limit=100000',
    'ttf|eot': 'file-loader',
    'wav|mp3': 'file-loader',
    'html': 'html-loader',
    'md|markdown': ['html-loader', 'markdown-loader']
};

/* raw stylesheets loaders */
var themeCssLoader = options.minimize ? 'css-loader!postcss-loader' : 'css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]!postcss-loader';
var themeCssFolders = [
    path.resolve(__dirname, './reveal/css/theme'),
];
var themeStylesheetLoaders = {
    'css': themeCssLoader,
    'less': [themeCssLoader, 'less-loader'],
    'styl': [themeCssLoader, 'stylus-loader'],
    'scss|sass': [themeCssLoader, 'sass-loader']
};
/* to build raw css loaders */
Object.keys(themeStylesheetLoaders).forEach(function(ext) {
    var sl = themeStylesheetLoaders[ext];
    if (Array.isArray(sl)) sl = sl.join('!');
    if (options.separateStylesheet) {
        themeStylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', sl);
    } else {
        themeStylesheetLoaders[ext] = 'style-loader!' + sl;
    }
});

/* raw stylesheets loaders */
var rawCssLoader = options.minimize ? 'css-loader!postcss-loader' : 'css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]!postcss-loader';
var rawCssFolders = [
    // global helper variable common css
    path.resolve(__dirname, './css'),
    path.resolve(__dirname, './reveal/css/reveal.scss'),
    path.resolve(__dirname, './src/js'),
    path.resolve('../node_modules'),
];
var rawStylesheetLoaders = {
    'css': rawCssLoader,
    'less': [rawCssLoader, 'less-loader'],
    'styl': [rawCssLoader, 'stylus-loader'],
    'scss|sass': [rawCssLoader, 'sass-loader']
};
/* to build raw css loaders */
Object.keys(rawStylesheetLoaders).forEach(function(ext) {
    var sl = rawStylesheetLoaders[ext];
    if (Array.isArray(sl)) sl = sl.join('!');
    if (options.separateStylesheet) {
        rawStylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', sl);
    } else {
        rawStylesheetLoaders[ext] = 'style-loader!' + sl;
    }
});

/* modular stylesheets loaders */
var modularCssLoader = options.minimize ? 'css-loader?module&importLoaders=1!postcss-loader' : 'css-loader?module&importLoaders=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss-loader';
var modularCssFolders = [
    path.resolve(__dirname, './src/components'),
];
var modularStylesheetLoaders = {
    'css': modularCssLoader,
    'less': [modularCssLoader, 'less-loader'],
    'styl': [modularCssLoader, 'stylus-loader'],
    'scss|sass': [modularCssLoader, 'sass-loader']
};

/* to build modular css loaders */
Object.keys(modularStylesheetLoaders).forEach(function(ext) {
    var sl = modularStylesheetLoaders[ext];
    if (Array.isArray(sl)) sl = sl.join('!');
    if (options.separateStylesheet) {
        modularStylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', sl);
    } else {
        modularStylesheetLoaders[ext] = 'style-loader!' + sl;
    }
});

/* webpack output */
var output = {
    path: path.join(__dirname, 'build', 'public'),
    publicPath: publicPath,
    filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
    chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
    sourceMapFilename: 'debugging/[file].map',
    pathinfo: options.debug
};
var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
];

if (options.copy) {
    plugins.push(
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'reveal/plugin'),
            to: path.join(__dirname, 'static/reveal/plugin'),
        }]));
}

if (options.hot) {
    //for node.js mode, same as --hot --inline of CLI mode
    Object.keys(entry).forEach(function(key) {
        entry[key] = [entry[key], 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:' + options.devPort];
    });
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        output: 'commons.js' + (options.longTermCaching ? '?[chunkhash]' : ''),
        chunks: ['main', 'edit', 'present']
    }));
}

//https://github.com/webpack/react-proxy-loader
//not tested
var asyncLoaders = {
    test: routerHandlers.map(function(name) {
        return path.join(__dirname, 'src', 'route-handlers', name);
    }),
    loader: 'react-proxy-loader'
};

if (options.separateStylesheet) {
    plugins.push(new ExtractTextPlugin('[name].css' + (options.longTermCaching ? '?[contenthash]' : '')));
}

if (options.minimize) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.NoErrorsPlugin()
    );
}

module.exports = {
    entry: entry,
    output: output,
    target: 'web',
    module: {
        loaders: additionalLoaders
            .concat(asyncLoaders)
            .concat(loadersByExtension(loaders))
            .concat(loadersByExtension(rawStylesheetLoaders).map(function(loader) {
                loader.include = rawCssFolders;
                return loader;
            }))
            .concat(loadersByExtension(modularStylesheetLoaders).map(function(loader) {
                loader.include = modularCssFolders;
                return loader;
            }))
            .concat(loadersByExtension(themeStylesheetLoaders).map(function(loader) {
                loader.include = themeCssFolders;
                return loader;
            }))
    },
    postcss: function() {
        return [precss, autoprefixer];
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
        alias: aliasLoader
    },
    externals: externals,
    resolve: {
        root: root,
        modulesDirectories: modulesDirectories,
        extensions: extensions,
        alias: alias
    },
    plugins: plugins,
    profile: true,
    //pass to webpack-dev-server
    devServer: {
        hot: true,
        //the same with output.publicPath
        publicPath: publicPath,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: {
            colors: true
        }
    },
    //configuration of stats.toJSON()
    statsConf: {
        chunkModules: true,
        excludeFromStats: excludeFromStats
    },
    devPort: options.devPort
};
