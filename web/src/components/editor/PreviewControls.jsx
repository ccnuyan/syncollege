import React, {PropTypes} from 'react';
import style from './PreviewControls.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class PreviewControls extends React.Component {
    constructor() {
        super();
        this.onSwitchToEditMode = this.onSwitchToEditMode.bind(this);
    }

    onSwitchToEditMode() {
        this.context.onSwitchToEditMode();
    }
    render() {
        var css = this.props.css;
        return <div>
            <div onClick={this.onSwitchToEditMode} className={cn(css.button, css.edit, 'hint--bottom-right')} data-hint="Edit">
                <span className={cn(css.icon, 'icon-pencil2')}></span>
            </div>
        </div>;
    }
}

PreviewControls.contextTypes = {
    onSwitchToEditMode: PropTypes.func.isRequired
};

export default styleable(style)(PreviewControls);
