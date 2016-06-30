import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';
import Actions from './Actions';
import Depth from './Depth';
import TextBlockActions from './TextBlockActions';
import ImageBlockActions from './ImageBlockActions';

class ToolbarEdit extends React.Component {

    onAddText() {
        RevealEditor.addText();
    }

    onAddImage() {
        RevealEditor.addImage();
    }

    render() {
        var css = this.props.css;

        if (!this.props.presentation.getIn(['currentPresentation', 'currentBlock', 'type'])) {
            return <div className={cn(css['toolbar-list'])}>
                <Actions></Actions>
                <Depth></Depth>
            </div>;
        }

        var type = this.props.presentation.getIn(['currentPresentation', 'currentBlock', 'type']);

        function getCustomizedEditOptions(t) {
            switch (t) {
                case 'text':
                    return <TextBlockActions></TextBlockActions>;
                    break;
                case 'image':
                    return <ImageBlockActions></ImageBlockActions>;
                    break;
                default:

            }
        }

        return <div className={cn(css['toolbar-list'])}>
            {getCustomizedEditOptions(type)}
            <Actions></Actions>
            <Depth></Depth>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(ToolbarEdit));
