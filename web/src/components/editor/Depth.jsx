import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class Depth extends React.Component {

    up() {
        RevealEditor.changeContentDepth('up');
    }

    down() {
        RevealEditor.changeContentDepth('down');
    }

    render() {
        var css = this.props.css;
        return <div className={cn(css['toolbar-option'], css['toolbar-multi'])} data-number-of-items="2">
            <h4 className={cn(css['toolbar-option-label'])}>Depth</h4>
            <div className={cn(css['toolbar-multi-inner'])}>
                <div onClick={this.up} className={cn(css['toolbar-multi-item'])}>
                    <span className={cn(css['icon'], 'icon-arrow-up')}></span>
                </div>
                <div onClick={this.down} className={cn(css['toolbar-multi-item'])}>
                    <span className={cn(css['icon'], 'icon-arrow-down')}></span>
                </div>
            </div>
        </div>;
    }
}

export default styleable(style)(Depth);
