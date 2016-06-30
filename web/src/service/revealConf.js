import _ from 'lodash';
var baseConf = {
    controls: true,
    progress: true,
    history: true,
    center: false,
    width: 960,
    height: 700,
    margin: 0.1,
    transition: 'slide', // none/fade/slide/convex/concave/zoom
    math: {
        mathjax: '//cdn.bootcss.com/mathjax/2.6.1/MathJax.js'
    }
    // Optional reveal.js plugins
};

var cdnbase = '//cdn.bootcss.com/reveal.js/3.3.0/';

export default {
    adConf: _.assign({
        minScale: 0.3,
        maxScale: 1.5,
        autoSlide: 5000,
        history:false,
        loop: true,
    }, baseConf),
    editingConf: _.assign({
        minScale: 1,
        maxScale: 1,
    }, baseConf),
    presentationPreviewConf: _.assign({
        minScale: 0.3,
        maxScale: 1.5,
    }, baseConf),
    playConf: _.assign({
        minScale: 0.3,
        maxScale: 1.5,
        dependencies: [{
            src: __ASSETS + 'vote.js',
            async: false,
        }, {
            src: __ASSETS + 'syncplayer.js',
            async: false,
        }]
    }, baseConf),
};
