//https://shouldjs.github.io/#should-equal
describe('editor', function() {
    describe('getHtml() test', function() {
        it('should RevealEditor.getHtml() working good', function(done) {
            should.exist(window.RevealEditor);

            var wrapper = _Y_.create('div', 'reveal');

            var slides = `<div class="slides" data-id="abc"><section data-id="abc"><div data-vote-selectable="single" class="sl-block" data-block-type="text" data-id="abc" style="width:100px;height:100px;"><div class="sl-block-content"></div></div><div data-vote-selectable="single" class="sl-block" data-block-type="image" data-id="abc" style="width:100px;height:100px;"><div class="sl-block-content"></div></div></section></div>`;

            var slidesWithGrabage = `<div class="slides something" data-id="abc"><section class="stack present" data-id="abc"><div data-vote-selectable="single" class="sl-block wo le ge ca" data-block-type="text" data-id="abc" style="width:100px;height:100px;"><div class="sl-block-content"></div><div class="editing-ui"></div></div><div data-vote-selectable="single" class="sl-block wo" data-block-type="image" data-id="abc" style="width:100px;height:100px;"><div class="sl-block-content"></div><div class="editing-ui"></div></div><div class="overviewing-ui"></div></section><div></div></div>`;

            var wrapper1 = _Y_.create('div', 'reveal');
            var wrapper2 = _Y_.create('div', 'reveal');

            _Y_.setHTML(wrapper1, slides);
            _Y_.setHTML(wrapper, slidesWithGrabage);
            _Y_.setHTML(wrapper2, RevealEditor.getHtml(wrapper));

            if (!wrapper1.isEqualNode(wrapper2)){
                console.log(wrapper1);
                console.log(wrapper2);
            }

            wrapper1.isEqualNode(wrapper2).should.be.true();
            done();
        });
    });
});
