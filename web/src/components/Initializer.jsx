import React, {PropTypes} from 'react';
import userActions from '../redux/actions/userActions';
import styleable from 'react-styleable';
import {connect} from 'react-redux';
import style from './Initializer.scss';
import classnames from 'classnames';

class Initializer extends React.Component {
    componentWillMount() {
        var token = window.localStorage.getItem('userToken');
        if (token) {
            userActions.dispatchIntializeAsync()(this.props.dispatch, function() {
                return this.props.user;
            }.bind(this));
        } else {
            this.props.dispatch(userActions.noTokenFound());
        }
    }

    render() {
        var css = this.props.css;
        var isLoading = this.props.user.get('isLoading');
        if (isLoading) {
            return (
                <div ref="loading">
                    <h1 className="dead-center"></h1>
                </div>
            );
        } else {
            var el = document.getElementById('page-spinner');
            if (el) {
                el.parentNode.removeChild(el);
            }
            return this.props.children;
        }
    }
}

var selector = function(state) {
    return {user: state.user};
};
export default connect(selector)(styleable(style)(Initializer));
