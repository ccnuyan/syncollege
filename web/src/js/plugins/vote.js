import _ from 'lodash';
import keymap from 'browser-keymap';
(function() {
    var sections = [];
    var allChoices = [];

    var singleChoices = document.querySelectorAll(`div.reveal>div.slides section>.sl-block[data-vote-selectable="single"]`);
    var multipleChoices = document.querySelectorAll(`div.reveal>div.slides section>.sl-block[data-vote-selectable="multiple"]`);

    var VoteCount = function(choice) {
        this.choice = choice;
        var color = getComputedStyle(this.choice.block)['color'];
        this.element = _Y_.create('div', 'vote-count', {
            position: 'absolute',
            left: '100%',
            margin: '-2px 0px 0px 5px',
            top: '0',
            color: color,
            display: 'none',
        });

        _Y_.setHTML(this.element, `<div style="font-size:70%;padding:2px 10px;background:blue;color:white; margin:0 2px;border-radius:20%"}>0</div>`);

        this.choice.block.appendChild(this.element);

        this.choice.block.addEventListener('mouseover', function(event) {
            _Y_.show(this.element);
        }.bind(this));

        this.choice.block.addEventListener('mouseleave', function(event) {
            _Y_.hide(this.element);
        }.bind(this));

        this.update = function(event) {
            _Y_.setHTML(this.element.firstChild, this.choice.submiters.length);
        };

        window.addEventListener('keydown', function(event) {
            if (keymap(event) === 'v') {
                _Y_.show(this.element);
            }
        }.bind(this));
        window.addEventListener('keyup', function(event) {
            if (keymap(event) === 'v') {
                _Y_.hide(this.element);
            }
        }.bind(this));
    };

    var VoteDecorator = function(choice) {
        this.choice = choice;
        var color = getComputedStyle(this.choice.block)['color'];
        this.element = _Y_.create('div', 'vote-decorator', {
            position: 'absolute',
            left: '-2px',
            top: '-2px',
            right: '-2px',
            bottom: '-2px',
            color: color,
            display: 'none',
            border: `2px solid ${color}`,
            borderRadius: '2px',
            opacity: '0.5',
        });

        this.choice.block.appendChild(this.element);

        this.choice.block.addEventListener('mouseover', function(event) {
            _Y_.show(this.element);
        }.bind(this));

        this.choice.block.addEventListener('mouseleave', function(event) {
            if (!this.choice.selected) _Y_.hide(this.element);
        }.bind(this));

        this.choice.block.addEventListener('mouseover', function(event) {
            _Y_.show(this.element);
        }.bind(this));

        this.choice.block.addEventListener('mouseleave', function(event) {
            _Y_.hide(this.element);
        }.bind(this));
    };

    var Choice = function(block) {
        this.block = block;
        this.section = this.block.parentNode.dataset.id;
        this.id = this.block.dataset.id;
        this.choiceType = this.block.dataset.voteSelectable;
        this.submiters = [];
        this.selected = false;
        this.color = getComputedStyle(this.block)['color'];

        this.voteDecorator = new VoteDecorator(this);
        if (window.snapshot.owner) {
            this.voteCount = new VoteCount(this);
        }
        this.setSelected = function() {
            var color = getComputedStyle(this.block)['color'];
            this.block.style.background = chroma(color).alpha(0.1).css();
            this.selected = true;
        }.bind(this);
        this.unSelected = function() {
            this.block.style.background = 'transparent';
            this.selected = false;
        }.bind(this);
        if (!window.snapshot.owner) {
            this.block.addEventListener('click', function(event) {
                if (this.choiceType === 'single') {
                    this.setSelected(this.block);
                } else {
                    if (this.selected) {
                        this.unSelected();
                    } else {
                        this.setSelected();
                    }
                }
            }.bind(this));

            this.block.addEventListener('click', function(event) {
                var evt = new CustomEvent('choiceSelected', {
                    detail: {
                        snapshot: window.snapshot._id,
                        section: this.section,
                        id: this.id,
                        choiceType: this.choiceType
                    }
                });
                window.root.dispatchEvent(evt);

                //to syncplayer
                var evt2 = new CustomEvent('decisionChanged', {
                    detail: {
                        user: _.pick(window.user, ['_id', 'username', 'nickname', 'anonymous']),
                        snapshot: window.snapshot._id,
                        section: this.section,
                        //make choice an object
                        choices: _.reduce(allChoices
                            .filter(function(choice) {
                                return choice.section === this.section;
                            }.bind(this)),
                            function(ret, choice) {
                                ret[choice.id] = choice.selected;
                                return ret;
                            }, {})
                    }
                });
                window.root.dispatchEvent(evt2);
            }.bind(this));

            //from other choices
            window.root.addEventListener('choiceSelected', function(event) {
                var detail = event.detail;

                if (detail.id === this.id) return;
                if (detail.section !== this.section) return;
                if (detail.choiceType === 'multiple') return;

                this.unSelected(this.block);
            }.bind(this));
        }

        this.injectState = function() {
            if (!window.snapshot.owner) {
                if (this.submiters.indexOf(window.user._id) >= 0) {
                    this.setSelected();
                };
            } else {
                this.voteCount.update();
            }
        };
    };


    Array.prototype.forEach.call(singleChoices, (choice) => allChoices.push(new Choice(choice)));
    Array.prototype.forEach.call(multipleChoices, (choice) => allChoices.push(new Choice(choice)));

    //from syncplayer
    window.root.addEventListener('listenerDecisionChanged', function(event) {
        var detail = event.detail;
        allChoices.forEach(function(choice) {
            if (choice.section === detail.section) {
                choice.submiters = detail.choices[choice.id] ? detail.choices[choice.id] : [];
            }
            choice.injectState();
        });
    }.bind(this));
})();
