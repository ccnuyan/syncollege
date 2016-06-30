import React, {PropTypes} from 'react';
import cn from 'classnames';
import styleable from 'react-styleable';
import style from './Presentation.scss';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class Presentation extends React.Component {
    constructor() {
        super();
        this.onNewClick = this.onNewClick.bind(this);
        this.onCreateNewPresentation = this.onCreateNewPresentation.bind(this);
    };

    componentDidMount() {
        this.refs['newPresentationInput'].addEventListener('keypress', function(e) {
            event.stopPropagation();
            if ((e.keyCode || e.which) == 13) {
                this.onCreateNewPresentation();
            }
        }.bind(this));

        this.refs['newPresentationInput'].addEventListener('blur', function(e) {
            _Y_.show(this.refs['plus']);
            _Y_.hide(this.refs['form']);
            this.refs['newPresentationInput'].value = '';
        }.bind(this));
    }

    onNewClick() {
        event.stopPropagation();
        _Y_.hide(this.refs['plus']);
        _Y_.show(this.refs['form']);
        this.refs['newPresentationInput'].focus();
    }

    onCreateNewPresentation() {
        var name = this.refs['newPresentationInput'].value;
        if (!name) {
            name = '我的作品';
        }
        presentationActions.dispatchCreateNewPresentationAsync({name: name})(this.props.dispatch, function() {
            return this.props.presentation;
        }.bind(this));
        this.refs['newPresentationInput'].blur();
    }

    render() {
        var css = this.props.css;
        return (
            <div onClick={this.onNewClick} className={cn(css.presentationEach, 'grid-child')}>
                <div className={css.newPresentation}>
                    <div className="dead-center">
                        <span style={{
                            verticalAlign: top,
                            margin: '3px'
                        }} ref="plus" className={cn('icon-plus', 'font-largest')}></span>
                    </div>
                    <div ref="form" className={css.newPresentationForm} style={{
                        display: 'none'
                    }}>
                        <textarea ref="newPresentationInput" placeholder="请输入幻灯片名称
                按回车确定" className={cn(css.newPresentationTextArea)} type="text"></textarea>
                    </div>
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {presentationState: state.presentation};
};

export default connect(selector)(styleable(style)(Presentation));
