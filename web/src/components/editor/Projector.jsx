import React, {PropTypes} from 'react';
import style from './Editor.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import revealConf from '../../service/revealConf.js';
import _ from 'lodash';

class Projector extends React.Component {
    constructor() {
        super();
        this.addNewSlide = this.addNewSlide.bind(this);
        this.addNewSubSlide = this.addNewSubSlide.bind(this);
    }
    addNewSlide() {
        RevealEditor.addNewSection();
    }
    addNewSubSlide() {
        RevealEditor.addNewSubSection();
    }

    shouldComponentUpdate(nextProps, nextState) {
        var pre = this.props.presentation.getIn(['currentPresentation', 'content']);
        var nxt = nextProps.presentation.getIn(['currentPresentation', 'content']);
        return pre !== nxt;
    }

    componentDidUpdate(prevProps, prevState) {
        var presentation = this.props.presentation.get('currentPresentation').toObject();
        if (!_.isEmpty(presentation)) {
            head.load(__ASSETS + '/' + presentation.theme + '.css');
            RevealEditor.initialize(presentation.content, true);
        }
    }

    componentDidMount() {
        this.refs['reveal-editor'].addEventListener('blockClick', function(event) {
            this.context.switchToEditPanel();
            this.props.dispatch(presentationActions.setCurrentBlock(event.detail));
        }.bind(this));
        this.refs['reveal-editor'].addEventListener('wrapperClick', function() {
            this.context.switchToAddPanel();
            this.props.dispatch(presentationActions.setCurrentBlockNull());
        }.bind(this));

        this.refs['reveal-editor'].addEventListener('requestDisk', function(event) {
            this.context.showDisk();
        }.bind(this));

        this.refs['reveal-editor'].addEventListener('overviewshown', function(event) {
            // RevealEditor.switchToManipulationMode();
        }.bind(this));

        this.refs['reveal-editor'].addEventListener('overviewhidden', function(event) {
            // RevealEditor.switchToNormalMode();
        }.bind(this));
    }

    render() {
        var css = this.props.css;

        return <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
        }}>
            <div ref="reveal-editor" className="reveal-editor" style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
            }}></div>
            <button onClick={this.addNewSlide} className={cn('icon-plus', 'button-primary', css['anchor-add-slide'])}></button>
            <button onClick={this.addNewSubSlide} className={cn('icon-plus', 'button-primary', css['anchor-add-sub-slide'])}></button>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

Projector.contextTypes = {
    switchToAddPanel: PropTypes.func.isRequired,
    switchToEditPanel: PropTypes.func.isRequired,
    showDisk: PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(Projector));
