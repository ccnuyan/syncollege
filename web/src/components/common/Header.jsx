import React, {PropTypes} from 'react';
import {PropTypes as RouterPropTypes} from 'react-router';
import style from './Header.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';
import _ from 'lodash';

class Header extends React.Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.dispatch(userActions.logout());
    }

    render() {
        var isActive = function(name) {
            var flag = this.context.router.isActive(name);
            if (flag)
                return true;
            return false;
        }.bind(this);

        var css = this.props.css;
        var payload = this.props.user.get('payload').toObject();

        return (
            <div style={{
                background: '#ccc'
            }}>
                <div data-target="/main" className={cn(css.logo)}>
                    Syncollege
                </div>
                {!_.isEmpty(payload)
                    ? <div className={cn(css.links)}>
                            <div className={cn(css.linkEach)}>
                                {`${payload.nickname}${payload.anonymous
                                    ? '(匿名)'
                                    : ''}`}
                            </div>
                            <div onClick={this.logout} className={cn(css.linkEach)}>
                                注销
                            </div>
                        </div>
                    : ''}
            </div>
        );
    }
}

Header.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function select(state) {
    return {dispatch: state.user.dispatch, user: state.user};
}

export default connect(select)(styleable(style)(Header));
