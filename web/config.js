var argv = require('yargs').argv;
var statsOutput = './build/';
var path = require('path');

var _assets = '';

if (argv.dev) {
    var _assets = 'http://www.syncollege.com:8080/_assets/';
} else if (argv.prod) {
    var _assets = '/_assets/';
} else {
    console.error('no mode parameter provided!');
    process.exit();
};

//所有页面都要添加的stylesheets
var sharedDevStyles = [
    '//cdn.bootcss.com/normalize/3.0.3/normalize.css',
    '//cdn.bootcss.com/humane-js/3.2.2/themes/flatty.css',
    '//cdn.bootcss.com/hint.css/2.1.0/hint.min.css',
    '//cdn.bootcss.com/reveal.js/3.3.0/css/reveal.css',
    '/font-icons/style.css',
];
var sharedProdStyles = [
    '//cdn.bootcss.com/normalize/3.0.3/normalize.min.css',
    '//cdn.bootcss.com/humane-js/3.2.2/themes/flatty.min.css',
    '//cdn.bootcss.com/hint.css/2.1.0/hint.min.css',
    '//cdn.bootcss.com/reveal.js/3.3.0/css/reveal.min.css',
    '/font-icons/style.css',
];
//所有页面都要添加的javascripts
var sharedDevJs = [
    '//cdn.bootcss.com/modernizr/2.8.3/modernizr.min.js',
    '//cdn.bootcss.com/classlist/2014.01.31/classList.min.js',
    '//cdn.bootcss.com/reveal.js/3.3.0/js/reveal.min.js',
    '//cdn.bootcss.com/chroma-js/1.1.1/chroma.min.js',
    '//cdn.bootcss.com/velocity/1.2.3/velocity.min.js',
    '/qrcode.min.js',
    '/y.js'
];
var sharedProdJs = [
    '//cdn.bootcss.com/modernizr/2.8.3/modernizr.min.js',
    '//cdn.bootcss.com/classlist/2014.01.31/classList.min.js',
    '//cdn.bootcss.com/reveal.js/3.3.0/js/reveal.min.js',
    '//cdn.bootcss.com/chroma-js/1.1.1/chroma.min.js',
    '//cdn.bootcss.com/velocity/1.2.3/velocity.min.js',
    '/qrcode.min.js',
    '/y.js',
];

var devDependencies = {
    main: {
        css: [
            `${_assets}editor.css`,
            `${_assets}black.css`,
        ],
        js: [
            '//cdn.bootcss.com/plupload/2.1.8/moxie.js',
            '//cdn.bootcss.com/plupload/2.1.8/plupload.dev.js',
            '/qiniu.js',
        ],
    },
    edit: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [
            '//cdn.bootcss.com/plupload/2.1.8/moxie.js',
            '//cdn.bootcss.com/plupload/2.1.8/plupload.dev.js',
            '/qiniu.js',
            '//cdn.bootcss.com/ckeditor/4.5.4/ckeditor.js',
            '/ckeditor-remove-extra-nbsp-plugin.js',
            `${_assets}editor.js`

        ],
    },
    present: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [],
    },
    play: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [
            `//cdn.bootcss.com/socket.io/1.4.6/socket.io.min.js`,
        ],
    }
};

var prodDependencies = {
    main: {
        css: [
            `${_assets}editor.css`,
            `${_assets}black.css`,
        ],
        js: [
            '//cdn.bootcss.com/plupload/2.1.8/plupload.full.min.js',
            '/qiniu.min.js',
        ],
    },
    edit: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [
            '//cdn.bootcss.com/plupload/2.1.8/plupload.full.min.js',
            '/qiniu.min.js',
            '//cdn.bootcss.com/ckeditor/4.5.4/ckeditor.js',
            '/ckeditor-remove-extra-nbsp-plugin.js',
            `${_assets}editor.js`,
        ],
    },
    present: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [],
    },
    play: {
        css: [
            `${_assets}editor.css`,
        ],
        js: [
            `//cdn.bootcss.com/socket.io/1.4.6/socket.io.min.js`,
        ],
    },
};

if (argv.dev) {
    module.exports = {
        title: 'DEV',
        randomException: false,
        assets: _assets,
        qiniu_url: 'http://7xt1pi.com1.z0.glb.clouddn.com/',
        ioHost: 'http://www.syncollege.com:3000/',
        apiBase: '/api/',
        qiniucontainer: 'test',
        maxDelay: 100,
        port: 8000,
        sharedStyles: sharedDevStyles,
        sharedJs: sharedDevJs,
        dependencies: devDependencies,
        domain: process.env.SYNCOLLEGE_DOMAIN,
        dev: true,
        webpack: {
            statsOutput: path.join(__dirname, `${statsOutput}dev.stats.json`),
            options: {
                devServer: true,
                devtool: 'eval-source-map',
                debug: true,
                minimize: false,
                hot: true,
                separateStylesheet: true,
                commonsChunk: true,
                longTermCaching: false,
                devPort: 8080,
                copy: false,
            }
        }
    };
} else if (argv.prod) {
    module.exports = {
        title: 'We Do Course',
        randomException: false,
        assets: _assets,
        qiniu_url: 'http://7xt1pl.com1.z0.glb.clouddn.com/',
        ioHost: 'http://www.syncollege.com:3000/',
        apiBase: '/api/',
        qiniucontainer: 'syncollege',
        maxDelay: 0,
        port: 8000,
        sharedStyles: sharedProdStyles,
        sharedJs: sharedProdJs,
        dependencies: devDependencies,
        domain: process.env.SYNCOLLEGE_DOMAIN,
        dev: false,
        webpack: {
            statsOutput: path.join(__dirname, `${statsOutput}build.stats.json`),
            options: {
                minimize: true,
                hot: false,
                separateStylesheet: true,
                commonsChunk: true,
                longTermCaching: true,
                copy: true,
            }
        }
    };
} else {
    console.error('no mode parameter provided!');
    process.exit();
};
