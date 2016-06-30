import keymap from 'browser-keymap';
(function() {

    function progressController(server) {
        if (window.snapshot.owner) {
            Reveal.addEventListener('slidechanged', function(event) {
                // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                //TODO owner only
                if (!window.justEmitted) {
                    server.emit('slidechanged', {
                        snapshot: window.snapshot._id,
                        user: window.user._id,
                        h: event.indexh,
                        v: event.indexv,
                    });
                } else {
                    window.justEmitted = false;
                }
            });
        }

        server.on('slidechanged', function(params) {
            window.justEmitted = true;
            Reveal.navigateTo(params.h, params.v);
        });
    }

    function voteController(server) {
        window.root.addEventListener('decisionChanged', function(event) {
            server.emit('listenerDecisionChanged', event.detail);
        });

        server.on('listenerDecisionChanged', function(params) {
            //to vote
            var evt2 = new CustomEvent('listenerDecisionChanged', {
                detail: params
            });
            window.root.dispatchEvent(evt2);
        });
    }

    function init() {
        window.io_agent = io.connect(__IO_HOST);

        window.io_agent.emit('join_snapshot', {
            snapshot: window.snapshot._id
        });

        //both single instance
        new progressController(window.io_agent);
        new voteController(window.io_agent);
    }

    if (window.snapshot) {
        init();
    } else {
        window.root.addEventListener('snapshotLoaded', function() {
            init();
        });
    }

    var QrcodeContainer = function() {
        this.element = _Y_.create('div', 'qrcodeContainer', {
            display: 'none',
            position: 'fixed',
            zIndex: 255,
            background: 'white',
            width: '100%',
            height: '100%'
        });

        _Y_.setHTML(this.element, `<div class="dead-center"></div>`);

        new QRCode(this.element.firstChild, {
            text: window.location.href,
            width: '800',
            height: '800',
            correctLevel: QRCode.CorrectLevel.H
        });

        window.root.appendChild(this.element);

        window.addEventListener('keydown', function(event) {
            if (keymap(event) === 'q') {
                _Y_.show(this.element);
            }
        }.bind(this));
        window.addEventListener('keyup', function(event) {
            if (keymap(event) === 'q') {
                _Y_.hide(this.element);
            }
        }.bind(this));
    };

    new QrcodeContainer();
}());
