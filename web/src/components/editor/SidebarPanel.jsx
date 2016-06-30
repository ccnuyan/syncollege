import React, {PropTypes} from 'react';
import style from './Editor.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import {connect} from 'react-redux';

class SidebarPanel extends React.Component {
    render() {
        var css = this.props.css;
        return <div className={cn(css['sidebar-panel'])}>Sidebar Panel</div>;
    }
}

export default styleable(style)(SidebarPanel);
