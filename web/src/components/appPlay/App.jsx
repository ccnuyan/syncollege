import React, {PropTypes} from 'react';
import style from './App.scss';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import styleable from 'react-styleable';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';
import cn from 'classnames';

class App extends React.Component {
    render() {
        var css = this.props.css;
        return (
            <div className={cn(css.app, 'dead-center')}>
                {this.props.children}
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user};
};

App.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(selector)(styleable(style)(App));
