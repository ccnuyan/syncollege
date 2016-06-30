function Axis(wrapper) {
    this.wrapper = wrapper;
    this.editor = wrapper.parentNode;
    this.slides = wrapper.querySelector('.slides');
    if (!this.slides) {
        throw new Error('slides not found!');
    }
    this.element = _Y_.create('canvas', ['axis', 'editing-ui'], {
        position: 'absolute',
        pointerEvents: 'none',
        display: 'none',
        fontSize: '1em',
        width: '100%',
        height: '100%',
        userSelect: 'none',
        border: '2px solid rgba(128,128,128,0.3)',
    });

    this.element.setAttribute('width', '960');
    this.element.setAttribute('height', '700');

    function initGrid(ax) {
        var context = ax.getContext('2d');
        context.beginPath();
        for (var left = 80; left < 960; left += 80) {
            context.moveTo(left, 0);
            context.lineTo(left, 700);
        }
        for (var top = 70; top < 700; top += 70) {
            context.moveTo(0, top);
            context.lineTo(960, top);
        }
        context.strokeStyle = 'rgba(128,128,128,0.3)';
        context.stroke();
    }

    initGrid(this.element);
    this.slides.appendChild(this.element);

    this.editor.addEventListener('onEnterEditMode', function() {
        if (Reveal.isOverview()) {
            Reveal.toggleOverview();
        }
        this.element.style.display = 'block';
    }.bind(this));

    this.editor.addEventListener('onEnterPreviewMode', function() {
        this.element.style.display = 'none';
    }.bind(this));

    Reveal.addEventListener('overviewhidden', function() {
        this.element.style.display = 'block';
    }.bind(this));

    Reveal.addEventListener('overviewshown', function() {
        this.element.style.display = 'none';
    }.bind(this));
};

export default Axis;
