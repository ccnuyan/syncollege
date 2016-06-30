//  loading animation:
//  http://pathgather.github.io/please-wait/

head.load(__CSS, function() {
    console.log('css loaded');
    head.load(__JS, function() {
        console.log('js loaded');
        _Y_.remove(document.getElementById('page-spinner'));
    });
});
