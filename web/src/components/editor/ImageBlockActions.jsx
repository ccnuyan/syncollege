import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';
import Stepper from './Stepper';

class ImageBlockActions extends React.Component {
    constructor() {
        super();

        this.setImageOpacity = this.setImageOpacity.bind(this);
    }
    setImageOpacity(value) {
        var float = parseFloat(value) / 100;
        RevealEditor.setOpacity(float);
    }

    render() {
        var css = this.props.css;
        var block = this.props.presentation.getIn(['currentPresentation', 'currentBlock']).toObject();

        return <div>
            <Stepper stepperType="opacity" changeCallback={this.setImageOpacity} label="Opacity" initialValue={block.image.opacity}></Stepper>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation};
};

export default connect(selector)(styleable(style)(ImageBlockActions));
