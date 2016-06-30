import React, {PropTypes} from 'react';
import style from './User.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';
import _ from 'lodash';
import redirect from '../../service/redirect';
import qqpng from './qq.png';

class LoginPage extends React.Component {
    constructor() {
        super();
    }
    componentWillUpdate(nextProps, nextState) {
        this.context.notLoginStateCheck.bind(this)(nextProps);
    }
    render() {
        var css = this.props.css;
        return (
            <div className={cn('container-mid', css.module)}>
                <div className={cn('heading-primary')}>选择登录方式</div>
                <div className={cn('container-mid', css.module)}>
                    <a href="/oauth/qq/luanch">
                        <img width="24" height="24" src={qqpng}/>
                        腾讯QQ
                    </a>
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user};
};

LoginPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    notLoginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(LoginPage));
