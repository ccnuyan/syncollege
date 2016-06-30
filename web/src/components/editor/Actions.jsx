import React, {PropTypes} from 'react';
import style from './Toolbar.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class Actions extends React.Component {

    remove() {
        RevealEditor.remove();
    }

    duplicate() {
        RevealEditor.duplicate();
    }

    render() {
        var css = this.props.css;
        return <div className={cn(css['toolbar-option'], css['toolbar-multi'])} data-number-of-items="2">
            <h4 className={cn(css['toolbar-option-label'])}>Actions</h4>
            <div className={cn(css['toolbar-multi-inner'])}>
                <div onClick={this.remove} className={cn(css['toolbar-multi-item'])}>
                    <span className={cn(css['icon'], 'icon-bin')}></span>
                </div>
                <div onClick={this.duplicate} className={cn(css['toolbar-multi-item'])}>
                    <span className={cn(css['icon'], 'icon-copy')}></span>
                </div>
            </div>
        </div>;
    }
}

export default styleable(style)(Actions);
