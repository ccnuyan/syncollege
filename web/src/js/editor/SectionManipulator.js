import _ from 'lodash';
var html = `
    <div data-man="delete"  style="position:absolute;right:0;top:0;height:200px;width:200px" class="man">
        <button style="width:200px;height:200px;font-size:100px" class="button-hollow icon-bin"></button>
    </div>
    <div data-man="left" style="position:absolute;left:0;top:50%;height:200px;width:200px;margin-top:-100px" class="man move-left">
        <button style="border-radius:100px;width:200px;height:200px;font-size:100px" class="button-hollow icon-arrow-left"></button>
    </div>
    <div data-man="right" style="position:absolute;right:0;top:50%;height:200px;width:200px;margin-top:-100px" class="man move-right">
        <button style="border-radius:100px;width:200px;height:200px;font-size:100px" class="button-hollow icon-arrow-right"></button>
    </div>
    <div data-man="up" style="position:absolute;top:0;left:50%;height:200px;width:200px;margin-left:-100px" class="man move-up">
        <button style="border-radius:100px;width:200px;height:200px;font-size:100px" class="button-hollow icon-arrow-up"></button>
    </div>
    <div data-man="down" style="position:absolute;bottom:0;left:50%;height:200px;width:200px;margin-left:-100px" class="man move-down">
        <button style="border-radius:100px;width:200px;height:200px;font-size:100px" class="button-hollow icon-arrow-down"></button>
    </div>
`;

var borderStyle = `style="border-radius:100px;width:200px;height:200px;font-size:100px;border:15px;background:#777"`;

var ManDelete = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        left: '50%',
        Top: '0%',
        height: '200px',
        width: '200px',
        marginLeft: '-100px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-bin"></button>`);
    this.element.addEventListener('click', function() {
        switch (this.manipulator.sectionType) {
            case 'onlysection':
                break;
            default:
                _Y_.remove(this.manipulator.section);
                break;
        }
        RevealEditor.refresh();
    }.bind(this));
    this.manipulator.element.appendChild(this.element);
};

var ManSubDelete = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        right: 0,
        top: 0,
        height: '200px',
        width: '200px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-bin"></button>`);
    this.element.addEventListener('click', function() {
        switch (this.manipulator.sectionType) {
            case 'onlysubsection':
                break;
            case 'onlysection':
            case 'firstsection':
            case 'lastsection':
            case 'section':
                _Y_.remove(this.manipulator.section.firstChild);
                break;
            default:
                _Y_.remove(this.manipulator.section);
                break;
        }
        RevealEditor.refresh();
    }.bind(this));
    this.manipulator.element.appendChild(this.element);
};

var ManMoveLeft = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        left: 0,
        bottom: '50%',
        height: '200px',
        width: '200px',
        marginBottom: '-100px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-arrow-left"></button>`);
    this.element.addEventListener('click', function() {
        console.log('man left click');
    });
    this.manipulator.element.appendChild(this.element);
};

var ManMoveRight = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        right: 0,
        bottom: '50%',
        height: '200px',
        width: '200px',
        marginBottom: '-100px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-arrow-right"></button>`);
    this.element.addEventListener('click', function() {
        console.log('man right click');
    });
    this.manipulator.element.appendChild(this.element);
};

var ManMoveUp = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        left: '50%',
        top: 0,
        height: '200px',
        width: '200px',
        marginLeft: '-100px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-arrow-up"></button>`);
    this.element.addEventListener('click', function() {
        console.log('man up click');
    });
    this.manipulator.element.appendChild(this.element);
};

var ManMoveDown = function(manipulator) {
    this.manipulator = manipulator;
    this.element = _Y_.create('div', 'man', {
        position: 'absolute',
        left: '50%',
        bottom: 0,
        height: '200px',
        width: '200px',
        marginLeft: '-100px'
    });
    _Y_.setHTML(this.element,
        `<button ${borderStyle} class="button-hollow icon-arrow-down"></button>`);
    this.element.addEventListener('click', function() {
        console.log('man down click');
    });
    this.manipulator.element.appendChild(this.element);
};

function SectionManipulator(parentSection) {
    if (!parentSection) {
        throw new Error('parentSection is required');
    }
    this.section = parentSection;

    if (this.section.parentNode.nodeName === 'DIV') {

        this.element = _Y_.create('div', ['overviewing-ui', 'manipulator', 'dead-center'], {
            zIndex: 255,
            width: '90%',
            height: '90%'
        });

        var childNodes = _.filter(this.section.parentNode.childNodes, function(node) {
            return node.nodeName === 'SECTION';
        });
        if (this.section.isSameNode(childNodes[0]) && this.section.isSameNode(childNodes[childNodes.length - 1])) {
            this.sectionType = 'onlysection';
        } else if (this.section.isSameNode(childNodes[0])) {
            this.sectionType = 'firstsection';
            new ManMoveRight(this);
            new ManDelete(this);
        } else if (this.section.isSameNode(childNodes[childNodes.length - 1])) {
            this.sectionType = 'lastsection';
            new ManMoveLeft(this);
            new ManDelete(this);
        } else {
            this.sectionType = 'section';
            new ManMoveLeft(this);
            new ManMoveRight(this);
            new ManDelete(this);
        }

        //first sub section's man located at it's parent
        var nodes = _.filter(this.section.childNodes, function(node) {
            return node.nodeName === 'SECTION';
        });
        if (nodes.length > 1) {
            new ManSubDelete(this);
            new ManMoveDown(this);
        }
    } else if (this.section.parentNode.nodeName === 'SECTION') {

        this.element = _Y_.create('div', ['overviewing-ui', 'manipulator', 'dead-center'], {
            zIndex: 255,
            width: '90%',
            height: '90%'
        });

        var childNodes = _.filter(this.section.parentNode.childNodes, function(node) {
            return node.nodeName === 'SECTION';
        });
        if (this.section.isSameNode(childNodes[0]) && this.section.isSameNode(childNodes[childNodes.length - 1])) {
            //only sub section's man located at it's parent
            this.sectionType = 'onlysubsection';
        } else if (this.section.isSameNode(childNodes[0])) {
            //first sub section's man located at it's parent
            this.sectionType = 'firstsubsection';
        } else if (this.section.isSameNode(childNodes[childNodes.length - 1])) {
            this.sectionType = 'lastsubsection';
            new ManMoveUp(this);
            new ManSubDelete(this);
        } else {
            this.sectionType = 'subsection';
            new ManMoveUp(this);
            new ManMoveDown(this);
            new ManSubDelete(this);
        }
    }

    this.section.appendChild(this.element);

    Reveal.addEventListener('overviewshown', function(event) {
        _Y_.show(this.element);
    }.bind(this));
    Reveal.addEventListener('overviewhidden', function(event) {
        _Y_.hide(this.element);
    }.bind(this));
    if (Reveal.isOverview()) {
        _Y_.show(this.element);
    } else {
        _Y_.hide(this.element);
    }
}

export default SectionManipulator;
