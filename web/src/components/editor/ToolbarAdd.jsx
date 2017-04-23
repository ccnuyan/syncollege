import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';

class ToolbarAdd extends React.Component {

    onAddText() {
        RevealEditor.addText();
    }

    onAddImage() {
        RevealEditor.addImage();
    }

    render() {
        var css = this.props.css;

        return <div className={cn(css['toolbar-list'])}>
            <div onClick={this.onAddText} className={cn(css['toolbar-add-block-option'])}>
                <span className={cn(css['toolbar-add-block-option-icon'])}>
                    <i className="icon-font-size"></i>
                </span>
                <span className={cn(css['toolbar-add-block-option-label'])}>文字</span>
            </div>
            <div onClick={this.onAddImage} className={cn(css['toolbar-add-block-option'])}>
                <span className={cn(css['toolbar-add-block-option-icon'])}>
                    <i className="icon-image"></i>
                </span>
                <span className={cn(css['toolbar-add-block-option-label'])}>图像</span>
            </div>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(ToolbarAdd));
