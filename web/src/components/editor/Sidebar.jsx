import React, {PropTypes} from 'react';
import style from './Sidebar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class Sidebar extends React.Component {

    constructor() {
        super();
        this.onSwitchToPreviewMode = this.onSwitchToPreviewMode.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onSwitchToPreviewMode() {
        this.context.onSwitchToPreviewMode();
    }

    onSave() {
        var current = this.props.presentation.get('currentPresentation');
        if (current.toObject()._id) {
            var html = RevealEditor.getHtml();

            presentationActions.dispatchUpdatePresentationAsync({id: current.toObject()._id, content: html})(this.props.dispatch, function() {
                return this.props.presentation;
            }.bind(this));
        }
    }

    render() {
        var css = this.props.css;
        return <div>
            <div className={css.primary}>
                <div onClick={this.onSwitchToPreviewMode} className={cn(css.button, css.preview, 'hint--right')} data-hint="预览">
                    <span className={cn(css.icon, 'icon-eye')}></span>
                </div>
                <div className={cn(css.button, css.undo, 'hint--right')} data-hint="撤销">
                    <span className={cn(css.icon, 'icon-arrow-up-left')}></span>
                </div>
                <div onClick={this.onSave} className={cn(css.button, css.save, 'hint--right')} data-hint="保存">
                    <span className={cn(css.icon, 'icon-floppy-disk')}></span>
                </div>
            </div>
            <div className={css.secondary}>
                <div className={cn(css.button, 'hint--right')} data-hint="设置">
                    <span className={cn(css.icon, 'icon-cog')}></span>
                </div>
            </div>
        </div>;
    }
}

Sidebar.contextTypes = {
    onSwitchToPreviewMode: PropTypes.func.isRequired
};

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(Sidebar));
