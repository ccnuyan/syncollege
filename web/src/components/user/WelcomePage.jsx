import React, {PropTypes} from 'react';
import style from './User.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';
import _ from 'lodash';
import redirect from '../../service/redirect';
import qqpng from './qq.png';

class WelcomePage extends React.Component {
    componentDidMount() {
        var info = {
            mode: 'transaction',
            lid: this.props.params.lid
        };

        userActions.dispatchLoginAsync(info)(this.props.dispatch, function() {
            return this.props.user;
        }.bind(this));
    }

    componentWillUpdate(nextProps, nextState) {
        this.context.notLoginStateCheck.bind(this)(nextProps);
    }

    render() {
        return (
            <div className="dead-center">...</div>
        );
    }
}

var selector = function(state) {
    return {user: state.user};
};

WelcomePage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    notLoginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(WelcomePage));
