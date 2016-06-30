//https://shouldjs.github.io/#should-equal
describe('fabricator', function() {
    var container = document.createElement('div');
    describe('getDefaultSlidesHTML', function() {
        it('should slides have data-slides-id', function(done) {
            var slides = SlidesFabricator.getDefaultSlidesHTML('abcdefg');
            container.innerHTML = slides;
            should.exist(container.querySelector('.slides'));
            should.equal(container.querySelector('.slides').getAttribute('data-slides-id'), 'abcdefg');
            done();
        });
    });
});
