import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';
import styleable from 'react-styleable';

import App from './App';
import MainPage from './MainPage';

import HomePage from '../../components/home/HomePage';
import LoginPage from '../../components/user/LoginPage';
import WelcomePage from '../../components/user/WelcomePage';

import DiskPage from '../../components/disk/DiskPage';
import PresentationPage from '../../components/presentation/PresentationPage';
import RecentSnapshotPage from '../../components/snapshot/RecentSnapshotPage';
import FavorateSnapshotPage from '../../components/snapshot/FavorateSnapshotPage';

import NotFoundPage from '../../components/common/NotFoundPage';
import userActions from '../../redux/actions/userActions';

import {createHistory, useBasename} from 'history';
import {Provider} from 'react-redux';
import {connect} from 'react-redux';
import cn from 'classnames';
import style from './Main.scss';
import redirect from '../../service/redirect';
import _ from 'lodash';

class MainRoutes extends React.Component {
    constructor() {
        super();
        this.loginRequired = this.loginRequired.bind(this);
        this.notLoginRequired = this.notLoginRequired.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    loginStateCheck(nextProps) {
        var payload = nextProps.user.get('payload').toObject();
        if (_.isEmpty(payload) || payload.anonymous) {
            this.context.router.push({pathname: '/login'});
        }
    }

    notLoginStateCheck(nextProps) {
        var payload = nextProps.user.get('payload').toObject();
        if (!_.isEmpty(payload) && !payload.anonymous) {
            this.context.router.push({pathname: '/main'});
        }
    }

    getChildContext() {
        var context = {
            loginStateCheck: this.loginStateCheck,
            notLoginStateCheck: this.notLoginStateCheck
        };
        return context;
    };

    //登陆检查
    loginRequired(nextState, replace, callback) {
        var payload = this.props.user.get('payload').toObject();

        if (_.isEmpty(payload) || payload.anonymous) {
            replace('/login');
            callback();
        } else {
            callback();
        }
    }

    //登陆检查
    notLoginRequired(nextState, replace, callback) {
        var isLoading = this.props.user.get('isLoading');
        var payload = this.props.user.get('payload').toObject();

        if (_.isEmpty(payload) || payload.anonymous) {
            callback();
        } else {
            replace('/');
            callback();
        }
    }

    render() {
        var location = window.location.pathname;
        var css = this.props.css;
        return (
            <div className={css.container}>
                <Router history={browserHistory}>
                    <Route path="/" component={App}>
                        <IndexRoute components={HomePage}/>
                        <Route onEnter={this.loginRequired} path="main" component={MainPage}>
                            <IndexRoute components={PresentationPage}/>
                            <Route path="mine" components={PresentationPage}></Route>
                            <Route path="disk" components={DiskPage}></Route>
                            <Route path="favorate" components={FavorateSnapshotPage}></Route>
                            <Route path="recent" components={RecentSnapshotPage}/>
                        </Route>
                        <Route onEnter={this.notLoginRequired} path="login" components={LoginPage}/> {/*第三方登录时发现绑定账户的回调*/}
                        <Route onEnter={this.notLoginRequired} path="welcome/:lid" components={WelcomePage}/> {/*第三方登录时未发现绑定账户的回调*/}
                        <Route path="*" components={NotFoundPage}/>
                    </Route>
                </Router>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user};
};

MainRoutes.childContextTypes = {
    loginStateCheck: PropTypes.func.isRequired,
    notLoginStateCheck: PropTypes.func.isRequired
};

export default styleable(style)(connect(selector)(MainRoutes));
